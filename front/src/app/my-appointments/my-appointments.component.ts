import { Component, OnInit } from '@angular/core';
import { Appointment } from '../Shared/models/branch.models';
import { BranchService } from '../Shared/services/branch/branch.service';
import { roleGetter } from '../app.module';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  displayedappointments: Appointment[] = [];
  role = roleGetter();

  rowsPerPage = 10;
  totalRecords = 0;
  currentPage = 1;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private branchService: BranchService,
  ) { }

  ngOnInit(): void {
    this.getAppointmets();
  }

  getAppointmets(): void {
    this.branchService.getUserAppointments().subscribe(appointments => {
      this.appointments = appointments.sort((a, b) => {
        const dateA = new Date(a.appointmentDate).getTime();
        const dateB = new Date(b.appointmentDate).getTime();
        return dateB - dateA; // Descending order
      });
      console.log(appointments);
      this.totalRecords = this.appointments.length;
      this.updateDisplayedAppointments();
    });
  }

  updateDisplayedAppointments(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.displayedappointments = this.appointments.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG paginator počinje od 0
    this.rowsPerPage = event.rows;
    this.updateDisplayedAppointments();
  }

  isFutureDate(appointmentDate: Date): boolean {
    const today = new Date();
    const appointment = new Date(appointmentDate);
    return appointment > today;
  }

  confirmCancellation(appointment: Appointment): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this appointment?',
      accept: () => {
        this.branchService.cancelAppointment(appointment.id).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Appointment Canceled', detail: 'The appointment has been successfully canceled.' });
            // Refresh the appointments list or handle UI update
            this.getAppointmets();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cancellation failed. Please try again later.' });
            // Additional error handling if necessary
          }
        });
      }
    });
  }

}
