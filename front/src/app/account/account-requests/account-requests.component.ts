import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountRequestDto } from 'src/app/Shared/models/account-response.models';
import { BackAccountService } from 'src/app/Shared/services/bankaccount/back-account.service';
import { roleGetter } from 'src/app/app.module';

@Component({
  selector: 'app-account-requests',
  templateUrl: './account-requests.component.html',
  styleUrls: ['./account-requests.component.scss']
})
export class AccountRequestsComponent implements OnInit {

  role = roleGetter();
  requests: AccountRequestDto[] = [];
  displayedRequests: AccountRequestDto[] = [];
  rowsPerPage = 10;
  totalRequests = 0;
  currentPage = 1;

  constructor(private accountService: BackAccountService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.accountService.getAllAccountRequests().subscribe(requests => {
      this.requests = requests;
      this.totalRequests = requests.length;
      this.updateDisplayedRequests();
    });
  }

  updateDisplayedRequests(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.displayedRequests = this.requests.slice(startIndex, endIndex);
  }

  confirmReviewRequest(requestId: number, isApproved: boolean): void {
    const action = isApproved ? 'prihvatanje' : 'odbijanje';
    this.confirmationService.confirm({
      message: `Da li ste sigurni da želite da izvršite ${action} zahteva?`,
      accept: () => {
        this.reviewAccountRequest(requestId, isApproved);
      }
    });
  }

  reviewAccountRequest(requestId: number, isApproved: boolean): void {
    this.accountService.reviewAccountRequest(requestId, isApproved).subscribe(() => {
      const resultMessage = isApproved ? 'Zahtev je prihvaćen.' : 'Zahtev je odbijen.';
      this.messageService.add({ severity: 'success', summary: 'Uspešno izvršeno!', detail: resultMessage });
      this.loadRequests(); // Ponovo učitajte zahteve
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Greška!', detail: 'Došlo je do greške.' });
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG paginator počinje od 0
    this.rowsPerPage = event.rows;
    this.updateDisplayedRequests();
  }

}
