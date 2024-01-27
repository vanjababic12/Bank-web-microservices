import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Branch } from 'src/app/Shared/models/branch.models';
import { BranchService } from 'src/app/Shared/services/branch/branch.service';

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
  sortOptions: SelectItem[]; // Za dropdown meni

  // Dodato za paginaciju
  rowsPerPage = 10;
  totalRecords = 0;
  currentPage = 1;

  constructor(private accountTypeService: BranchService, private router: Router) {
    this.sortOptions = [
      { label: 'Ime', value: 'name' },
      { label: 'Adresa', value: 'address' },
      // Dodajte ostale opcije po potrebi
    ];
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.accountTypeService.searchBranches(this.searchTerm, this.sortField, this.ascending)
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
  viewAppointments(branchId: number): void {
    console.log('Pregled termina za filijalu ID:', branchId);
    this.router.navigate(['/appointments', branchId]);
  }

}
