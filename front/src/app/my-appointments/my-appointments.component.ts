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

  constructor(private branchService: BranchService) { }

  ngOnInit(): void {
    this.branchService.getUserAppointments().subscribe(appointments => {
      this.appointments = appointments;
    });
  }

}
