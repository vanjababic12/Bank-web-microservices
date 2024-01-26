import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoanRequest } from 'src/app/Shared/models/loan-response.models';
import { LoanService } from 'src/app/Shared/services/loan/loan.service';
import { roleGetter } from 'src/app/app.module';

@Component({
  selector: 'app-loan-requests',
  templateUrl: './loan-requests.component.html',
  styleUrls: ['./loan-requests.component.scss']
})
export class LoanRequestsComponent implements OnInit {

  role = roleGetter();
  loanRequests: LoanRequest[] = [];
  displayedLoanRequests: LoanRequest[] = [];
  isLoading: boolean = false;
  rowsPerPage = 10;
  totalLoanRequests = 0;
  currentPage = 1;

  constructor(
    private loanRequestService: LoanService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadLoanRequests();
  }

  loadLoanRequests(): void {
    this.isLoading = true;
    this.loanRequestService.getAllLoanRequests().subscribe(
      data => {
        this.loanRequests = data;
        this.totalLoanRequests = data.length;
        this.updateDisplayedLoanRequests();
        this.isLoading = false;
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Greška', detail: 'Učitavanje nije uspelo, pokušajte ponovo.' });
        this.isLoading = false;
      }
    );
  }

  updateDisplayedLoanRequests(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.displayedLoanRequests = this.loanRequests.slice(startIndex, endIndex);
  }

  confirmReviewLoanRequest(loanRequestId: number, isApproved: boolean): void {
    const action = isApproved ? 'prihvatanje' : 'odbijanje';
    this.confirmationService.confirm({
      message: `Da li ste sigurni da želite da izvršite ${action} zahteva?`,
      accept: () => {
        this.reviewLoanRequest(loanRequestId, isApproved);
      }
    });
  }

  reviewLoanRequest(loanRequestId: number, isApproved: boolean): void {
    // Pretpostavka: loanRequestService ima metodu 'reviewLoanRequest'
    this.loanRequestService.reviewLoanRequest(loanRequestId, isApproved).subscribe(() => {
      const resultMessage = isApproved ? 'Zahtev je prihvaćen.' : 'Zahtev je odbijen.';
      this.messageService.add({ severity: 'success', summary: 'Uspešno izvršeno!', detail: resultMessage });
      this.loadLoanRequests();
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Greška!', detail: 'Došlo je do greške.' });
    });
  }


  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.rowsPerPage = event.rows;
    this.updateDisplayedLoanRequests();
  }

}
