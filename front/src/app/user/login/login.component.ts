import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Shared/services/auth/auth.service';
import { UserService } from '../shared/user.service';
import { LoginDto } from 'src/app/Shared/models/user.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isProccessing = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)])
  });

  isLoading = false;

  constructor(private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }
  // Funkcija za mapiranje forme na DTO
  mapLoginFormToLoginDto(): LoginDto {
    const formValue = this.loginForm.value;

    return {
      username: formValue.username,
      password: formValue.password
    };
  }
  login() {
    if (this.loginForm.valid) {
      const loginDto: LoginDto = this.mapLoginFormToLoginDto();
      this.isLoading = true;
      this.userService.login(loginDto).subscribe(
        data => {
          this.isLoading = false;
          console.log(data);
          this.authService.loginUser(data);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successfull' });
          this.router.navigateByUrl('/home');
        },
        (error) => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
          console.log(error);
        }
      )
    }
  }
}
