import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BranchDto } from 'src/app/Shared/models/branch.models';
import { BranchService } from 'src/app/Shared/services/branch/branch.service';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.scss']
})

export class CreateBranchComponent implements OnInit {

  isLoading = false;
  branchForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    address: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    openingTime: new FormControl('', Validators.required),
    closingTime: new FormControl('', Validators.required)
  });

  constructor(private branchService: BranchService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void { }

  mapFormToBranchDto(): BranchDto {
    const formValue = this.branchForm.value;

    const formattedOpeningTime = this.formatTime(new Date(formValue.openingTime));
    const formattedClosingTime = this.formatTime(new Date(formValue.closingTime));

    return {
      name: formValue.name,
      address: formValue.address,
      phoneNumber: formValue.phoneNumber,
      openingTime: formattedOpeningTime,
      closingTime: formattedClosingTime,
    };
  }

  formatTime(time: Date): string {
    const hours = ('0' + time.getHours()).slice(-2);
    const minutes = ('0' + time.getMinutes()).slice(-2);
  
    return `${hours}:${minutes}:00`;
  }

  createBranch() {
    if (this.branchForm.valid) {
      const branchDto: BranchDto = this.mapFormToBranchDto();
      console.log(branchDto);

      this.branchService.createBranch(branchDto).subscribe(
        data => {
          if (data) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New worker added successfully' });
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
