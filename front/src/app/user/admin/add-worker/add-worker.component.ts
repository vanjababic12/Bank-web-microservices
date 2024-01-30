import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { RegisterDto, RegisterWorkerDto } from 'src/app/Shared/models/user.models';
import { UserService } from '../../shared/user.service';
import { Branch } from 'src/app/Shared/models/branch.models';
import { BranchService } from 'src/app/Shared/services/branch/branch.service';
import { minimumAgeValidator } from 'src/app/Shared/validation/age.validation';

@Component({
  selector: 'app-add-worker',
  templateUrl: './add-worker.component.html',
  styleUrls: ['./add-worker.component.scss']
})

export class AddWorkerComponent implements OnInit {
  minDate = new Date(new Date().getFullYear() - 120, 0, 1); // 120 years ago
  maxDate = new Date(new Date().getFullYear() - 18, new Date().getDay(), new Date().getMonth()); // 18 years ago
  branches: SelectItem<Branch>[]; // Lista svih filijala
  isLoading = false;
  addWorkerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(30)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    firstname: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    birthdayDate: new FormControl(this.maxDate, [Validators.required, minimumAgeValidator(18)]),
    branch: new FormControl<Branch>(null, Validators.required),
    address: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
  });

  constructor(private userService: UserService, private branchService: BranchService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.branchService.searchBranches().subscribe(branches => {
      this.branches = branches.map(i => {
        return {
          label: i.name,
          value: i
        }
      });
    });
  }

  mapFormToRegisterDto(): RegisterWorkerDto {
    const formValue = this.addWorkerForm.value;
    const birthdayTimestamp = new Date(formValue.birthdayDate).getTime();

    console.log(formValue);
    return {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      firstName: formValue.firstname,
      lastName: formValue.lastname,
      birthday: birthdayTimestamp,
      address: formValue.address,
      branchId: formValue.branch.id // Assuming the branch object has an 'id' property
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
