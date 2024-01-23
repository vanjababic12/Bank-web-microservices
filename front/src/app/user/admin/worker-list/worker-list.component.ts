import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserDto } from 'src/app/Shared/models/user.models';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-worker-list',
  templateUrl: './worker-list.component.html',
  styleUrls: ['./worker-list.component.scss']
})
export class WorkerListComponent implements OnInit {

  users: UserDto[] = [];
  displayedUsers: UserDto[] = [];
  rowsPerPage = 10;
  totalRecords = 0;
  currentPage = 1;

  constructor(private userService: UserService, private confirmationService: ConfirmationService,
              private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.getAllWorkers();
  }

  getAllWorkers(): void {
    this.userService.getAllWorkers().subscribe(data => {
      this.users = data;
      this.totalRecords = data.length;
      this.updateDisplayedUsers();
    });
  }

  updateDisplayedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.displayedUsers = this.users.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.rowsPerPage = event.rows;
    this.updateDisplayedUsers();
  }

  confirmDeletion(user: UserDto): void {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete ${user.firstName} ${user.lastName} account?`,
      accept: () => {
        this.userService.deleteWorker(user.username).subscribe(
          data => {
            if (data) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: `Worker ${user.username} deleted successfully` });
              this.getAllWorkers();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Bad request' });
            }
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successfull' });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
          }
        );
      }
    });
  }
}


