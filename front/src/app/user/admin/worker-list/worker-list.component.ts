import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { UserDisplayDto, UserDto } from 'src/app/Shared/models/user.models';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';
import { roleGetter } from 'src/app/app.module';

@Component({
  selector: 'app-worker-list',
  templateUrl: './worker-list.component.html',
  styleUrls: ['./worker-list.component.scss']
})
export class WorkerListComponent implements OnInit {

  users: UserDisplayDto[] = [];
  displayedUsers: UserDisplayDto[] = [];
  searchTerm: string = '';
  sortField: string = 'name';
  role = roleGetter();
  ascending: boolean = true;
  sortOptions: SelectItem[]; // Za dropdown meni

  rowsPerPage = 10;
  totalRecords = 0;
  currentPage = 1;

  constructor(private router: Router, private userService: UserService,
    private confirmationService: ConfirmationService, private messageService: MessageService,) {
    this.sortOptions = [
      { label: 'Username', value: 'username' },
      { label: 'FirsT Name', value: 'fistname' },
      { label: 'Last Name', value: 'lastname' },
      { label: 'Email', value: 'email' },
    ];
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.userService.searchWorkers(this.searchTerm, this.sortField, this.ascending)
      .subscribe(workers => {
        console.log(workers);
        this.users = workers;
        this.totalRecords = workers.length;
        this.updateDisplayedWorkers();
    });
  }

  toggleSortOrder(): void {
    this.ascending = !this.ascending;
    this.search();
  }

  sortWorkers(): void {
    this.search()
  }

  updateDisplayedWorkers(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.displayedUsers = this.users.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG paginator počinje od 0
    this.rowsPerPage = event.rows;
    this.updateDisplayedWorkers();
  }

  confirmDelete(workerUsername: string): void {
    console.log(this.users);
    let worker = this.users.find(i => i.userName == workerUsername);
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete this worker <b>${worker.firstName}</b>?`,
      accept: () => {
        this.deleteWorker(worker.userName);
        this.search();
      }
    });
  }

  deleteWorker(workerUsername: string): void {
    this.userService.deleteWorker(workerUsername).subscribe(
    (response: any) => {
      console.log('Delete worker response:', response);
      this.messageService.add({ severity: 'success', summary: 'Success!', detail: 'Worker is deleted.' });
      this.search(); // Ponovo učitajte listu workera-ova
    },
    (error: any) => {
      console.error('Error during worker deletion:', error);
      this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error while trying to delete worker..' });
    });
  }
}


