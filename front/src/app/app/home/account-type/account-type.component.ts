import { Component, OnInit } from '@angular/core';
import { AccountTypeDto } from 'src/app/Shared/models/account.models';
import { BackAccountService } from 'src/app/Shared/services/bankaccount/back-account.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { roleGetter } from 'src/app/app.module';
import { Router } from '@angular/router';

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
  role = roleGetter();
  ascending: boolean = true;
  sortOptions: SelectItem[]; // Za dropdown meni

  // Dodato za paginaciju
  rowsPerPage = 10;
  totalRecords = 0;
  currentPage = 1;

  constructor(private router: Router, private accountTypeService: BackAccountService,
    private confirmationService: ConfirmationService, private messageService: MessageService,) {
    this.sortOptions = [
      { label: 'Name', value: 'name' },
      { label: 'Description', value: 'description' },
      { label: 'Currency', value: 'currency' },
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

  confirmDelete(accountTypeId: number): void {
    let accountType = this.accountTypes.find(i => i.id == accountTypeId);
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete this account type <b>${accountType.name}</b>?`,
      accept: () => {
        this.deleteAccountType(accountTypeId);
        this.search();
      }
    });
  }

  deleteAccountType(accountTypeId: number): void {
    this.accountTypeService.deleteAccountType(accountTypeId).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success!', detail: 'Account type is deleted.' });
      this.search(); // Ponovo učitajte listu AccountType-ova
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error while trying to delete account type..' });
    });
  }

  confirmAccountRequest(accountType: AccountTypeDto): void {
    this.confirmationService.confirm({
      message: `Are you sure that you want to send the request for this account type <b>${accountType.name}</b>?`,
      accept: () => {
        this.createAccountRequest(accountType);
      }
    });
  }

  createAccountRequest(accountType: AccountTypeDto): void {
    const createAccountRequestDto = { accountTypeId: accountType.id };
    this.accountTypeService.createAccountRequest(createAccountRequestDto).subscribe(response => {
      this.messageService.add({ severity: 'success', summary: 'Request sent!', detail: 'Request successfully issued.' });
      // Opcionalno: Osvežite podatke ili preduzmite dodatne akcije
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Maximum of two account request are allowed.' });
    });
  }
}
