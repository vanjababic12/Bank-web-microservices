import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './core/guard/admin.guard';
import { CustomerGuard } from './core/guard/customer.guard';
import { LoggedInGuard } from './core/guard/loggedIn.guard';
import { LoginGuard } from './core/guard/login.guard';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { RegisterComponent } from './user/register/register.component';
import { CreateBranchComponent } from './user/admin/create-branch/create-branch.component';
import { AddWorkerComponent } from './user/admin/add-worker/add-worker.component';
import { CreateAppointmentComponent } from './user/admin/create-appointment/create-appointment.component';
import { CreateAccountTypeComponent } from './user/admin/create-account-type/create-account-type.component';
import { CreateLoanTypeComponent } from './user/admin/create-loan-type/create-loan-type.component';
import { CreateExchangeRatesComponent } from './user/admin/create-exchange-rates/create-exchange-rates.component';
import { WorkerListComponent } from './user/admin/worker-list/worker-list.component';
import { AccountTypeComponent } from './app/home/account-type/account-type.component';
import { BranchesComponent } from './app/home/branches/branches.component';
import { LoansComponent } from './app/home/loans/loans.component';

const routes: Routes = [
  { path: '', pathMatch: "full", redirectTo: 'home' },
  { path: 'home', component: AccountTypeComponent },
  { path: 'accountTypes', component: AccountTypeComponent },
  { path: 'loanTypes', component: LoansComponent },
  { path: 'branches', component: BranchesComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginGuard] },
  { path: 'workers', component: WorkerListComponent, canActivate: [AdminGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [LoggedInGuard] },
  { path: 'branches/create-branch', component: CreateBranchComponent, canActivate: [AdminGuard]},
  { path: 'users/add-worker', component: AddWorkerComponent, canActivate: [AdminGuard]},
  { path: 'appointments/create-appointment', component: CreateAppointmentComponent, canActivate: [AdminGuard]},
  { path: 'types/create-account-type', component: CreateAccountTypeComponent, canActivate: [AdminGuard]},
  { path: 'loans/create-loan-type', component: CreateLoanTypeComponent, canActivate: [AdminGuard]},
  { path: 'exchange/create-exchange-rates', component: CreateExchangeRatesComponent, canActivate: [AdminGuard]},
  { path: 'branches/create-branch', component: CreateBranchComponent, canActivate: [AdminGuard] },
  { path: 'users/add-worker', component: AddWorkerComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
