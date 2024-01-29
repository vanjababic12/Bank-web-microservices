import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Branch, CreateAppointmentDto, SelectFormControl } from '../../../Shared/models/branch.models';
import { BranchService } from 'src/app/Shared/services/branch/branch.service';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss']
})
export class CreateAppointmentComponent implements OnInit {
  branchOptions: object[] = [];
  branches: Branch[] = [];
  isLoading = false;
  minTime = new Date();
  maxTime = new Date();
  appointmentForm = new FormGroup({
    branch: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]) as SelectFormControl,
    date: new FormControl('', [Validators.required, this.isSunday.bind(this), this.isFutureDate.bind(this)]),
    time: new FormControl('', [Validators.required, this.isWithinWorkingHours.bind(this)]),
  });


  constructor(private branchService: BranchService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.branchService.searchBranches().subscribe(
      (data: Branch[]) => {
        if (data && data.length > 0) {
          this.branches = data;
          this.appointmentForm.get('time')?.setValue(this.convertTimeToHHMM(data[0].openingTime));
          // console.log(this.formatDate(Date()));
          this.appointmentForm.get('date')?.setValue(this.formatDate(Date()));
          console.log(this.appointmentForm.value);
          // this.appointmentForm.patchValue({ time: data[0].openingTime }, { emitEvent: true });
          this.branchOptions = data.map(branch => ({ label: branch.name, value: branch.id }));
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No branches found.' });
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      }
    );
    this.appointmentForm.get('branch')?.valueChanges.subscribe(selectedBranchId => {
      this.updateTimeConstraints(selectedBranchId);
    });
  }

  private updateTimeConstraints(branchId: number) {
    const selectedBranch = this.branches.find(branch => branch.id === branchId);
    if (selectedBranch) {
      // Pretpostavimo da su radna vremena u formatu "HH:mm"
      const [openingHour, openingMinute] = selectedBranch.openingTime.split(':').map(Number);
      const [closingHour, closingMinute] = selectedBranch.closingTime.split(':').map(Number);

      this.minTime.setHours(openingHour, openingMinute, 0);
      this.maxTime.setHours(closingHour, closingMinute, 0);
    }
  }

  createAppointment() {
    if (this.appointmentForm.valid) {
      const createAppointmentDto: CreateAppointmentDto = this.mapFormToCreateAppointmentDto();
      console.log(createAppointmentDto);
      this.branchService.addAppointment(createAppointmentDto).subscribe(
        data => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Appointment created successfully.' });
          this.router.navigateByUrl("/loanTypes");
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill out the form correctly.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill out the form correctly.' });
    }
  }

  private mapFormToCreateAppointmentDto(): CreateAppointmentDto {
    const selectedBranchId = this.appointmentForm.value.branch;
    const selectedDate = new Date(this.appointmentForm.value.date);
    const selectedTime = this.appointmentForm.value.time;

    // Formatiranje datuma i vremena u string
    // console.log(selectedDate);
    // console.log(this.dateToHHMM(selectedTime));
    const appointmentDate = this.formatDateTime(selectedDate, this.dateToHHMM(selectedTime));

    return new CreateAppointmentDto(
      selectedBranchId,
      appointmentDate,
    );
  }

  private dateToHHMM(timestamp: string): string {
    const date = new Date(timestamp);
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();

    // Pad single digit hours and minutes with a leading zero
    hours = hours.length < 2 ? '0' + hours : hours;
    minutes = minutes.length < 2 ? '0' + minutes : minutes;

    return `${hours}:${minutes}`;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString(); // getMonth() returns 0-11
    let year = date.getFullYear().toString(); // get last two digits of year

    // Pad single digit day and month with a leading zero
    day = day.length < 2 ? '0' + day : day;
    month = month.length < 2 ? '0' + month : month;

    return `${day}.${month}.${year}`;
  }

  private formatDateTime(date: Date, time: string): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Mesece u JavaScriptu brojimo od 0
    const day = date.getDate();

    // Formatiranje datuma u "YYYY-MM-DDTHH:MM" format
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${time}`;
  }


  private isSunday(control: FormControl) {
    const date = new Date(control.value);
    if (date.getDay() === 0) { // Nedelja je 0 u JavaScriptu
      return { isSunday: true };
    }
    return null;
  }

  private convertTimeToHHMM(time: string): string {
    const parts = time.split(':');
    if (parts.length >= 2) {
      return parts[0] + ':' + parts[1]; // Returns HH:mm part
    }
    return time; // Return original time if it's not in expected format
  }

  private isWithinWorkingHours(control: FormControl) {
    if (this.appointmentForm == undefined) return null;
    const selectedBranchId = this.appointmentForm.value.branch;
    const selectedBranch = this.branches.find(b => b.id === selectedBranchId);
    if (selectedBranch) {
      const appointmentTime = this.formatTime(control.value);
      const [openingHour, openingMinute] = selectedBranch.openingTime.split(':').map(Number);
      const [closingHour, closingMinute] = selectedBranch.closingTime.split(':').map(Number);

      const [appointmentHour, appointmentMinute] = appointmentTime.split(':').map(Number);

      const appointmentTimeDate = new Date();
      appointmentTimeDate.setHours(appointmentHour, appointmentMinute, 0);

      const openingTimeDate = new Date();
      openingTimeDate.setHours(openingHour, openingMinute, 0);

      const closingTimeDate = new Date();
      closingTimeDate.setHours(closingHour, closingMinute, 0);

      if (appointmentTimeDate < openingTimeDate || appointmentTimeDate > closingTimeDate) {
        return { outOfWorkingHours: true };
      }
    }
    return null;
  }

  formatTime(date: Date): string {
    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
  }

  private isFutureDate(control: FormControl) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(control.value);

    if (selectedDate < today) {
      return { isPastDate: true };
    }
    return null;
  }
}
