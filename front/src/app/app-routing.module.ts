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

const routes: Routes = [
  { path: '', pathMatch: "full", redirectTo: 'home' },
  { path: 'home', component: ProfileComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginGuard] },
  { path: 'workers', component: ProfileComponent, canActivate: [AdminGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [LoggedInGuard] },
  { path: 'branches/create-branch', component: CreateBranchComponent, canActivate: [AdminGuard]},
  { path: 'users/add-worker', component: AddWorkerComponent, canActivate: [AdminGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
