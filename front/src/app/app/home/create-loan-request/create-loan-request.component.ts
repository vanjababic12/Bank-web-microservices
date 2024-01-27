import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { LoanType } from 'src/app/Shared/models/loan-response.models';
import { CreateLoanRequestDto, LoanTypeDto } from 'src/app/Shared/models/loan.models';
import { LoanService } from 'src/app/Shared/services/loan/loan.service';

@Component({
  selector: 'app-create-loan-request',
  templateUrl: './create-loan-request.component.html',
  styleUrls: ['./create-loan-request.component.scss']
})
export class LoanRequestComponent implements OnInit {
  loanType: LoanType;
  selectedInstallments: number;
  loanAmount: number = 500;
  monthlyPayment: number;
  installmentOptions: SelectItem[] = [
    { label: '3', value: 3 },
    { label: '6', value: 6 },
    { label: '9', value: 9 },
    { label: '12', value: 12 },
    { label: '24', value: 24 },
    { label: '48', value: 48 },
    { label: '96', value: 96 }
  ];
  constructor(private route: ActivatedRoute, private loanService: LoanService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const loanTypeId = params['id'];
      console.log(params);
      this.loanService.searchLoanTypes().subscribe(loanTypes => {
        this.loanType = loanTypes.find(type => type.id == loanTypeId);
        console.log(loanTypes);
      });
    });
  }

  calculateMonthlyPayment(): void {
    if (this.loanAmount && this.selectedInstallments && this.loanType) {
      const rate = this.loanType.interestRate / 100;
      this.monthlyPayment = (this.loanAmount + (this.loanAmount * rate)) / this.selectedInstallments;
    }
  }

  submitLoanRequest(): void {
    const loanRequestDto: CreateLoanRequestDto = {
      amount: this.loanAmount,
      numberOfInstallments: this.selectedInstallments,
      loanTypeId: this.loanType.id
    };

    this.loanService.createLoanRequest(loanRequestDto).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Loan request submitted successfully' });
        this.router.navigate(['/loans/requests']);
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Maximum of one lone request is allowed.' });
      }
    );
  }


}
