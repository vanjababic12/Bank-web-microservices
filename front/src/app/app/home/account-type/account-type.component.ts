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
      { label: 'Ime', value: 'name' },
      { label: 'Opis', value: 'description' },
      { label: 'Valuta', value: 'currency' },
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
    var accountType = this.accountTypes.find(i => i.id == accountTypeId);
    this.confirmationService.confirm({
      message: `Da li ste sigurni da želite da obrišete tip racuna <b>${accountType.name}</b>?`,
      accept: () => {
        this.deleteAccountType(accountTypeId);
        this.search();
      }
    });
  }

  deleteAccountType(accountTypeId: number): void {
    this.accountTypeService.deleteAccountType(accountTypeId).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Uspešno!', detail: 'AccountType je obrisan.' });
      this.search(); // Ponovo učitajte listu AccountType-ova
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Greška!', detail: 'Došlo je do greške pri brisanju.' });
    });
  }

  confirmAccountRequest(accountType: AccountTypeDto): void {
    this.confirmationService.confirm({
      message: `Da li ste sigurni da želite da podnesete zahtev za tip racuna <b>${accountType.name}</b>?`,
      accept: () => {
        this.createAccountRequest(accountType);
      }
    });
  }

  createAccountRequest(accountType: AccountTypeDto): void {
    const createAccountRequestDto = { accountTypeId: accountType.id };
    this.accountTypeService.createAccountRequest(createAccountRequestDto).subscribe(response => {
      this.messageService.add({ severity: 'success', summary: 'Zahtev poslat!', detail: 'Zahtev za izdavanje računa je uspešno poslat.' });
      // Opcionalno: Osvežite podatke ili preduzmite dodatne akcije
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Greška!', detail: 'Došlo je do greške pri podnošenju zahteva.' });
    });
  }


}
