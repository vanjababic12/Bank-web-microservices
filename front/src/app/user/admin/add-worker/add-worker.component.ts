import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RegisterDto } from 'src/app/Shared/models/user.models';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-add-worker',
  templateUrl: './add-worker.component.html',
  styleUrls: ['./add-worker.component.scss']
})

export class AddWorkerComponent implements OnInit {

  isLoading = false;
  addWorkerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(30)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    firstname: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    birthdayDate: new FormControl('', Validators.required),
    address: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
  });

  constructor(private userService: UserService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
  }

  mapFormToRegisterDto(): RegisterDto {
    const formValue = this.addWorkerForm.value;
    const birthdayTimestamp = new Date(formValue.birthdayDate).getTime();

    return {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      firstName: formValue.firstname,
      lastName: formValue.lastname,
      birthday: birthdayTimestamp,
      address: formValue.address
    };
  }

  addWorker() {
    if (this.addWorkerForm.valid) {
      const registerDto: RegisterDto = this.mapFormToRegisterDto();
      this.userService.addWorker(registerDto).subscribe(
        data => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New worker added successfully' });
          this.router.navigateByUrl("/workers");
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        }
      );
    }
  }

}
