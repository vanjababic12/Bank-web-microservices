import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService, SelectItem } from 'primeng/api';
import { BranchService } from 'src/app/Shared/services/branch/branch.service';
import { Appointment, AppointmentDto, Branch, CreateAppointmentDto } from 'src/app/Shared/models/branch.models';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-branch-appointments',
  templateUrl: './branch-appointments.component.html',
  styleUrls: ['./branch-appointments.component.scss']
})
export class BranchAppointmentsComponent implements OnInit {
  branches: SelectItem<Branch>[]; // Lista svih filijala
  selectedBranch: Branch; // Trenutno izabrana filijala
  availableDates: SelectItem[]; // Dostupni datumi za izabranu filijalu
  selectedDate: Date; // Trenutno izabrani datum
  appointments: Appointment[]; // Termini za izabrani datum
  selectedAppointment: Appointment | null = null;
  loading: boolean = false;
  noAvailableDates: boolean = false;
  bookingInProgress: boolean = false;

  constructor(
    private branchService: BranchService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.branchService.searchBranches().subscribe(branches => {
      this.branches = branches.map(i => {
        return {
          label: i.name,
          value: i
        }
      });
      this.loading = false;
    });
  }

  onBranchSelect(): void {
    if (this.selectedBranch) {
      this.loading = true;
      this.branchService.getAvailableAppointmentDates(this.selectedBranch.id).subscribe(dateStrings => {
        this.availableDates = dateStrings.map(ds => {
          const date = new Date(ds);
          return { label: date.toDateString(), value: date };
        });
        this.noAvailableDates = this.availableDates.length === 0;
        this.loading = false;
      });
    }
  }

  onDateChange(): void {
    if (this.selectedDate) {
      this.loading = true;
      this.branchService.getAvailableAppointments(this.selectedBranch.id, this.selectedDate).subscribe(appointments => {
        console.log('Dobijeni termini:', appointments); // Dodajte ovu liniju
        this.appointments = appointments;
        this.loading = false;
      });
    }
  }

  selectAppointment(appointment: Appointment): void {
    if (this.selectedAppointment === appointment) {
      this.selectedAppointment = null; // Deselektuj ako je već selektovan
    } else {
      this.selectedAppointment = appointment;
    }
  }

  bookAppointment(): void {
    if (this.selectedAppointment) {
      this.bookingInProgress = true;
      const appointmentDto = new AppointmentDto(this.selectedAppointment.id);
      this.branchService.bookAppointment(appointmentDto).subscribe(result => {
        this.bookingInProgress = false;
        this.messageService.add({ severity: 'success', summary: 'Uspešno', detail: 'Termin uspešno rezervisan' });
        this.router.navigate(['/path-to-booked-appointments']); // Putanja do liste zakazanih termina
      }, error => {
        this.bookingInProgress = false;
        this.messageService.add({ severity: 'error', summary: 'Greška', detail: 'Došlo je do greške pri rezervaciji' });
      });
    }
  }

}
