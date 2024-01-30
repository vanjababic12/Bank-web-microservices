import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountDto } from 'src/app/Shared/models/account.models';
import { BackAccountService } from 'src/app/Shared/services/bankaccount/back-account.service';

@Component({
  selector: 'app-my-accounts',
  templateUrl: './my-accounts.component.html',
  styleUrls: ['./my-accounts.component.scss']
})
export class MyAccountsComponent implements OnInit {
  accounts: AccountDto[] = [];
  displayedAccounts: AccountDto[] = [];
  isLoading: boolean = true;
  loadingError: boolean = false;
  rowsPerPage = 3;
  totalAccounts = 0;
  currentPage = 1;

  constructor(private accountService: BackAccountService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.accountService.getAccounts().subscribe(
      accounts => {
        this.accounts = accounts;
        this.totalAccounts = accounts.length;
        this.updateDisplayedAccounts();
        this.isLoading = false;
      },
      error => {
        this.loadingError = true;
        this.isLoading = false;
      }
    );
  }

  reloadAccounts(): void {
    this.loadingError = false;
    this.loadAccounts();
  }

  navigateToAccountTypes(): void {
    this.router.navigate(['accountTypes']);
  }

  updateDisplayedAccounts(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.displayedAccounts = this.accounts.slice(startIndex, endIndex);
  }

  confirmCloseAccount(accountId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure that u want to close this account?',
      accept: () => {
        this.closeAccount(accountId);
      }
    });
  }

  closeAccount(accountId: number): void {
    this.accountService.closeAccount(accountId).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success!', detail: 'Account closed successfully..' });
      this.loadAccounts(); // Ponovo učitajte listu naloga
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error!', detail: `Can't close an account at the moment. Please try again later.` });
    });
  }

  navigateToRequests(): void {
    this.router.navigate(['/accounts/requests']);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.rowsPerPage = event.rows;
    this.updateDisplayedAccounts();
  }

}
