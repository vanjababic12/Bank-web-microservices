import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { LoanType } from 'src/app/Shared/models/loan-response.models';
import { LoanTypeDto } from 'src/app/Shared/models/loan.models';
import { LoanService } from 'src/app/Shared/services/loan/loan.service';
import { roleGetter } from 'src/app/app.module';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {

  loanTypes: LoanType[] = [];
  displayedLoanTypes: LoanType[] = [];
  searchTerm: string = '';
  role = roleGetter();
  sortField: string = 'name';
  ascending: boolean = true;
  sortOptions: SelectItem[]; // Za dropdown meni
  selectedLoanType: LoanType;
  showLoanRequestDialog: boolean = false;

  // Dodato za paginaciju
  rowsPerPage = 5;
  totalRecords = 0;
  currentPage = 1;

  constructor(private accountTypeService: LoanService, private router: Router) {
    this.sortOptions = [
      { label: 'Ime', value: 'name' },
      { label: 'Opis', value: 'description' },
      { label: 'Kamata', value: 'interestRate' },
      // Dodajte ostale opcije po potrebi
    ];
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.accountTypeService.searchLoanTypes(this.searchTerm, this.sortField, this.ascending)
      .subscribe(accountTypes => {
        console.log(accountTypes);
        this.loanTypes = accountTypes;
        this.totalRecords = accountTypes.length;
        this.updateDisplayedAccountTypes();
      });
  }

  toggleSortOrder(): void {
    this.ascending = !this.ascending;
    this.search();
  }

  sortAccountTypes(): void {
    this.search()
  }

  updateDisplayedAccountTypes(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.displayedLoanTypes = this.loanTypes.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG paginator počinje od 0
    this.rowsPerPage = event.rows;
    this.updateDisplayedAccountTypes();
  }

  openLoanRequestDialog(loanType: LoanType): void {
    // this.selectedLoanType = loanType;
    this.router.navigate(['/loans/create-request', loanType.id]);
  }

  handleLoanRequestSubmission(requestData: any): void {
    // Logika za obradu podnetog zahteva
  }

}
