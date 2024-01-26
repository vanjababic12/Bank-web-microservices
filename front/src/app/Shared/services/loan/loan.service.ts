import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoanRequest, LoanType } from '../../models/loan-response.models';
import { CreateLoanRequestDto, LoanTypeDto } from '../../models/loan.models';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getAllLoanTypes(): Observable<LoanType[]> {
    return this.http.get<LoanType[]>(`${this.apiUrl}/loans/types`);
  }

  searchLoanTypes(searchTerm?: string, sortField?: string, ascending?: boolean): Observable<LoanType[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.append('searchTerm', searchTerm);
    if (sortField) params = params.append('sortField', sortField);
    if (ascending !== undefined) params = params.append('ascending', ascending.toString());

    return this.http.get<LoanType[]>(`${this.apiUrl}/loans/types/search`, { params });
  }

  createLoanType(loanTypeDto: LoanTypeDto): Observable<LoanType> {
    return this.http.post<LoanType>(`${this.apiUrl}/loans/types`, loanTypeDto);
  }

  deleteLoanType(loanTypeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/loans/types/${loanTypeId}`);
  }

  getAllLoanRequests(): Observable<LoanRequest[]> {
    return this.http.get<LoanRequest[]>(`${this.apiUrl}/loans/requests`);
  }

  createLoanRequest(loanRequestDto: CreateLoanRequestDto): Observable<LoanRequest> {
    return this.http.post<LoanRequest>(`${this.apiUrl}/loans/requests`, loanRequestDto);
  }

  reviewLoanRequest(requestId: number, isApproved: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/loans/requests/${requestId}`, isApproved);
  }
}
