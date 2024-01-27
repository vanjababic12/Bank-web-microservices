import { Component, OnInit } from '@angular/core';
import { Appointment } from '../Shared/models/branch.models';
import { BranchService } from '../Shared/services/branch/branch.service';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  displayedappointments: Appointment[] = [];

  rowsPerPage = 2;
  totalRecords = 0;
  currentPage = 1;

  constructor(private branchService: BranchService) { }

  ngOnInit(): void {
    this.getAppointmets();
  }

  getAppointmets(): void {
    this.branchService.getUserAppointments().subscribe(appointments => {
      this.appointments = appointments;
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

}
