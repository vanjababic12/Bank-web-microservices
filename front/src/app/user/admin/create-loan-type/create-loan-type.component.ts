import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoanTypeDto } from 'src/app/Shared/models/loan.models';
import { LoanService } from 'src/app/Shared/services/loan/loan.service';

@Component({
  selector: 'app-create-loan-type',
  templateUrl: './create-loan-type.component.html',
  styleUrls: ['./create-loan-type.component.scss']
})

export class CreateLoanTypeComponent implements OnInit {

  isLoading = false;
  loanTypeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    interestRate: new FormControl(null, [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)])
  });

  constructor(private loanService: LoanService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void { }

  mapFormToLoanTypeDto(): LoanTypeDto {
    const formValue = this.loanTypeForm.value;

    return {
      name: formValue.name,
      interestRate: formValue.interestRate,
      description: formValue.description
    };
  }

  createLoanType() {
    if (this.loanTypeForm.valid) {
      const loanTypeDto: LoanTypeDto = this.mapFormToLoanTypeDto();

      this.loanService.createLoanType(loanTypeDto).subscribe(
        data => {
          if (data) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New loan type added successfully' });
            this.router.navigateByUrl("/home");
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Bad request' });
          }
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Unknown error' });
        }
      );
      
    }
  }
}
