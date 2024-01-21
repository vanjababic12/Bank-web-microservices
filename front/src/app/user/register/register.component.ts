import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../shared/user.service';
import { RegisterDto } from 'src/app/Shared/models/user.models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {

  isLoading = false;
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(30)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    firstname: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]),
    birthdayDate: new FormControl('', Validators.required),
    birthday: new FormControl(0),
    address: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
  });

  constructor(private userService: UserService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
  }

  // Funkcija za mapiranje forme na DTO
  mapFormToRegisterDto(): RegisterDto {
    const formValue = this.registerForm.value;

    // Pretvaranje datuma rođenja u timestamp
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

  register() {
    if (this.registerForm.valid) {
      const registerDto: RegisterDto = this.mapFormToRegisterDto();
      this.userService.addUser(registerDto).subscribe(
        data => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successfull' });
          this.router.navigateByUrl("/login")
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        }
      )
    }
  }

}
