import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Shared/services/auth/auth.service';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { UpdateUserDto } from 'src/app/Shared/models/user.models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;
  role = this.authService.roleStateObservable.value;
  isLoading = false;
  isSavingEdit = false;
  isEditing = false;
  editUserForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]),
    birthdayDate: new FormControl(new Date(), Validators.required),
    birthday: new FormControl(0),
    address: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
  });

  constructor(private authService: AuthService, private userService: UserService, private messageService: MessageService, private sanitizer: DomSanitizer) {
    this.loadUser();
    this.editUserForm.disable();
  }

  ngOnInit(): void {
    this.authService.roleStateObservable.subscribe(
      data => {
        this.role = data;
      }
    )
  }

  updateUser() {
    if (this.editUserForm.valid) {
      console.log(this.editUserForm.value);
      //this.userService.
    }
  }

  loadUser() {
    this.userService.getUser().subscribe(
      data => {
        console.log(data);
        this.user = new User(data);
        this.editUserForm.patchValue(data);
      }
    )
  }
  // Funkcija za mapiranje forme na DTO
  mapEditFormToUpdateUserDto(): UpdateUserDto {
    const formValue = this.editUserForm.value;

    // Pretvaranje datuma rođenja u timestamp
    const birthdayTimestamp = formValue.birthdayDate.getTime();

    return {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      birthday: birthdayTimestamp,
      address: formValue.address
    };
  }

  saveChanges() {
    if (this.editUserForm.valid) {
      this.isSavingEdit = true;
      const updateUserDto: UpdateUserDto = this.mapEditFormToUpdateUserDto();
      this.userService.updateUser(updateUserDto).subscribe(
        data => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Changes saved.' });
          this.isEditing = false;
          this.isSavingEdit = false;
          this.editUserForm.disable();
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
          this.isSavingEdit = false;
        }
      )
    }
  }

  edit() {
    this.editUserForm.enable();
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.editUserForm.disable();
    this.loadUser();
  }

}
