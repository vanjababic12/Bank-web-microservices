import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Branch } from 'src/app/Shared/models/branch.models';
import { BranchService } from 'src/app/Shared/services/branch/branch.service';
import { roleGetter } from 'src/app/app.module';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {

  branches: Branch[] = [];
  displayedBranches: Branch[] = [];
  searchTerm: string = '';
  sortField: string = 'name';
  ascending: boolean = true;
  role = roleGetter();
  sortOptions: SelectItem[]; // Za dropdown meni

  // Dodato za paginaciju
  rowsPerPage = 10;
  totalRecords = 0;
  currentPage = 1;

  constructor(private branchService: BranchService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.sortOptions = [
      { label: 'Name', value: 'name' },
      { label: 'Address', value: 'address' },
      // Dodajte ostale opcije po potrebi
    ];
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.branchService.searchBranches(this.searchTerm, this.sortField, this.ascending)
      .subscribe(branches => {
        console.log(branches);
        this.branches = branches;
        this.totalRecords = branches.length;
        this.updateDisplayedAccountTypes();
      });
  }

  toggleSortOrder(): void {
    this.ascending = !this.ascending;
    this.search();
  }

  sort(): void {
    this.search()
  }

  updateDisplayedAccountTypes(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.displayedBranches = this.branches.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG paginator počinje od 0
    this.rowsPerPage = event.rows;
    this.updateDisplayedAccountTypes();
  }

  viewAppointments(): void {
    this.router.navigate(['/appointments']);
  }

  confirmDelete(branchId:number): void {
    let branch = this.branches.find(i => i.id == branchId);
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete this branch <b>${branch.name}</b>?`,
      accept: () => {
        this.deleteBranch(branchId);
        this.search();
      }
    });
  }

  deleteBranch(branchId: number): void {
    this.branchService.deleteBranch(branchId).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success!', detail: 'Branch is deleted.' });
      this.search(); // Ponovo učitajte listu AccountType-ova
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error while trying to delete a branch.' });
    });
  }
}
