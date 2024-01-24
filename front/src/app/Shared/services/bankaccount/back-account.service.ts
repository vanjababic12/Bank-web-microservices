import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountDto, AccountRequestDto, AccountTypeDto as AccountTypeDto, CreateAccountTypeDto } from '../../models/account.models';
import { Observable } from 'rxjs';
import { AccountRequestResponse, AccountResponse, AccountTypeResponse } from '../../models/account-response.models';

@Injectable({
  providedIn: 'root'
})
export class BackAccountService {
  private apiUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  searchAccountTypes(searchTerm?: string, sortField?: string, ascending?: boolean): Observable<AccountTypeDto[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.append('searchTerm', searchTerm);
    if (sortField) params = params.append('sortField', sortField);
    if (ascending !== undefined) params = params.append('ascending', ascending.toString());

    return this.http.get<AccountTypeDto[]>(`${this.apiUrl}/types/search`, { params });
  }

  createAccountType(accountTypeDto: CreateAccountTypeDto): Observable<AccountTypeResponse> {
    return this.http.post<AccountTypeResponse>(`${this.apiUrl}/types`, accountTypeDto);
  }

  getAllAccountRequests(): Observable<AccountRequestResponse[]> {
    return this.http.get<AccountRequestResponse[]>(`${this.apiUrl}/requests`);
  }

  deleteAccountType(accountTypeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/types/${accountTypeId}`);
  }

  createAccountRequest(accountRequestDto: AccountRequestDto): Observable<AccountRequestResponse> {
    return this.http.post<AccountRequestResponse>(`${this.apiUrl}/requests`, accountRequestDto);
  }

  reviewAccountRequest(requestId: number, isApproved: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/requests/${requestId}`, { isApproved });
  }

  getCustomerAccounts(): Observable<AccountResponse[]> {
    return this.http.get<AccountResponse[]>(`${this.apiUrl}/customer`);
  }

  createAccount(accountDto: AccountDto): Observable<AccountResponse> {
    return this.http.post<AccountResponse>(`${this.apiUrl}/create`, accountDto);
  }

  closeAccount(accountId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/close/${accountId}`, {});
  }
}
