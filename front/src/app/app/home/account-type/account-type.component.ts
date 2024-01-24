import { Component, OnInit } from '@angular/core';
import { AccountTypeDto } from 'src/app/Shared/models/account.models';
import { BackAccountService } from 'src/app/Shared/services/bankaccount/back-account.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss']
})
export class AccountTypeComponent implements OnInit {
  accountTypes: AccountTypeDto[] = [];
  displayedAccountTypes: AccountTypeDto[] = [];
  searchTerm: string = '';
  sortField: string = 'name';
  ascending: boolean = true;
  sortOptions: SelectItem[]; // Za dropdown meni

  // Dodato za paginaciju
  rowsPerPage = 10;
  totalRecords = 0;
  currentPage = 1;

  constructor(private accountTypeService: BackAccountService) {
    this.sortOptions = [
      { label: 'Ime', value: 'name' },
      { label: 'Opis', value: 'description' },
      // Dodajte ostale opcije po potrebi
    ];
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.accountTypeService.searchAccountTypes(this.searchTerm, this.sortField, this.ascending)
      .subscribe(accountTypes => {
        console.log(accountTypes);
        this.accountTypes = accountTypes;
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
    this.displayedAccountTypes = this.accountTypes.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG paginator počinje od 0
    this.rowsPerPage = event.rows;
    this.updateDisplayedAccountTypes();
  }

}
