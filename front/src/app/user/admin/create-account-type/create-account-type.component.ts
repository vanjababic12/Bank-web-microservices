import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AccountTypeDto } from 'src/app/Shared/models/account.models';
import { BackAccountService } from 'src/app/Shared/services/bankaccount/back-account.service';

@Component({
  selector: 'app-create-account-type',
  templateUrl: './create-account-type.component.html',
  styleUrls: ['./create-account-type.component.scss']
})
export class CreateAccountTypeComponent implements OnInit {

  isLoading = false;
  accountTypeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    description: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
  });

  constructor(private backAccountService: BackAccountService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void { }

  mapFormToAccountTypeDto(): AccountTypeDto {
    const formValue = this.accountTypeForm.value;

    return {
      name: formValue.name,
      description: formValue.description
    };
  }

  createAccountType() {
    if (this.accountTypeForm.valid) {
      const accountTypeDto: AccountTypeDto = this.mapFormToAccountTypeDto();

      this.backAccountService.createAccountType(accountTypeDto).subscribe(
        data => {
          if (data) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New account type added successfully' });
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
