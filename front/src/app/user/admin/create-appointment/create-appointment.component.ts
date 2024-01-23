import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Branch, SelectFormControl } from '../../../Shared/models/branch.models'
import { BranchService } from 'src/app/Shared/services/branch/branch.service';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss']
})

export class CreateAppointmentComponent implements OnInit {
  branchOptions: object[] = [];
  isLoading = false;
  appointmentForm = new FormGroup({
    branch: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]) as SelectFormControl,
    date: new FormControl('', Validators.required),
    time: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
  });

  constructor(private branchService:BranchService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.branchService.getAllBranches().subscribe(
      (data: Branch[]) => {
        if (data && data.length > 0) {
          this.branchOptions = data.map(branch => ({ label: branch.name, value: branch.id }));

        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No branches found' });
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      }
    );
  }

  // mapFormToAppointmentDto(): RegisterDto {
  //   const formValue = this.appointmentForm.value;
  //   const birthdayTimestamp = new Date(formValue.birthdayDate).getTime();

  //   return {
  //     username: formValue.username,
  //     email: formValue.email,
  //     password: formValue.password,
  //     firstName: formValue.firstname,
  //     lastName: formValue.lastname,
  //     birthday: birthdayTimestamp,
  //     address: formValue.address
  //   };
  // }

  createAppointment() {
    // if (this.appointmentForm.valid) {
    //   const registerDto: RegisterDto = this.mapFormToRegisterDto();
    //   this.userService.addWorker(registerDto).subscribe(
    //     data => {
    //       if (data) {
    //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New worker added successfully' });
    //         this.router.navigateByUrl("/home");
    //       } else {
    //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Bad request' });
    //       }
    //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successfull' });
    //       this.router.navigateByUrl("/login")
    //     },
    //     error => {
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
    //     }
    //   );
    // }
  }

}
