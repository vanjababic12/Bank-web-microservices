import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Appointment, AppointmentDto, Branch, BranchDto, CreateAppointmentDto } from '../../models/branch.models';
import { BookAppointmentResult } from '../../models/branch-response.models';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private apiUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getAllBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.apiUrl}/branches`);
  }

  getBranch(id: number): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl}/branches/${id}`);
  }

  searchBranches(searchTerm?: string, sortField?: string, ascending?: boolean): Observable<Branch[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.append('searchTerm', searchTerm);
    if (sortField) params = params.append('sortField', sortField);
    if (ascending !== undefined) params = params.append('ascending', ascending.toString());

    return this.http.get<Branch[]>(`${this.apiUrl}/branches/search`, { params });
  }

  createBranch(branchDto: BranchDto): Observable<Branch> {
    return this.http.post<Branch>(`${this.apiUrl}/branches/create`, branchDto);
  }

  updateBranch(id: number, branchDto: BranchDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/branches/${id}`, branchDto);
  }

  deleteBranch(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/branches/${id}`);
  }

  getAvailableAppointments(branchId: number, date: Date): Observable<Appointment[]> {
    // Prilagođavanje datuma na početak dana i konverzija u ISO string
    const adjustedDate = new Date(date);
    adjustedDate.setHours(0, 0, 0, 0);
    const dateString = adjustedDate.toISOString();
    return this.http.get<Appointment[]>(`${this.apiUrl}/branches/appointments`, { params: { branchId, date: dateString } });
  }
  getAvailableAppointmentDates(branchId: number): Observable<Date[]> {
    return this.http.get<Date[]>(`${this.apiUrl}/branches/appointments/available`, { params: { branchId } });
  }

  addAppointment(appointmentDto: CreateAppointmentDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/branches/appointments`, appointmentDto);
  }

  bookAppointment(appointmentDto: AppointmentDto): Observable<BookAppointmentResult> {
    return this.http.put<BookAppointmentResult>(`${this.apiUrl}/branches/appointments`, appointmentDto);
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/branches/appointments/${appointmentId}`);
  }

  getUserAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/branches/myappointments`);
  }
}
