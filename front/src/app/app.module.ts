import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { OrderListModule } from 'primeng/orderlist';
import { LoginComponent } from './user/login/login.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './user/register/register.component';
import { CalendarModule } from 'primeng/calendar';
import { ProfileComponent } from './user/profile/profile.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { CreateBranchComponent } from './user/admin/create-branch/create-branch.component';
import { AddWorkerComponent } from './user/admin/add-worker/add-worker.component';
import { CreateAppointmentComponent } from './user/admin/create-appointment/create-appointment.component';
import { CreateAccountTypeComponent } from './user/admin/create-account-type/create-account-type.component';
import { CreateLoanTypeComponent } from './user/admin/create-loan-type/create-loan-type.component';
import { CreateExchangeRatesComponent } from './user/admin/create-exchange-rates/create-exchange-rates.component';
import { TableModule } from 'primeng/table';
import { WorkerListComponent } from './user/admin/worker-list/worker-list.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';

export function roleGetter() {
  return localStorage.getItem('role');
}

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    CreateBranchComponent,
    AddWorkerComponent,
    CreateAppointmentComponent,
    CreateAccountTypeComponent,
    CreateLoanTypeComponent,
    CreateExchangeRatesComponent,
    WorkerListComponent,
  ],
  imports: [
    PaginatorModule,
    BrowserModule,
    ToastModule,
    InputNumberModule,
    ReactiveFormsModule,
    MessageModule,
    MessagesModule,
    AppRoutingModule,
    ButtonModule,
    RippleModule,
    DataViewModule,
    PanelModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    HttpClientModule,
    RatingModule,
    FormsModule,
    CardModule,
    OrderListModule,
    BrowserAnimationsModule,
    CalendarModule,
    InputTextareaModule,
    TabViewModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    TableModule,
    JwtModule.forRoot(
      {
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: environment.allowedDomains
        }
      }
    )
  ],
  providers: [
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
