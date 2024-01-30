import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountDto, AccountTypeDto as AccountTypeDto, CreateAccountTypeDto, ExchangeTransferDto } from '../../models/account.models';
import { Observable } from 'rxjs';
import { AccountRequestDto, AccountResponse, AccountTypeResponse, CreateAccountRequestDto } from '../../models/account-response.models';

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

    return this.http.get<AccountTypeDto[]>(`${this.apiUrl}/accountType/search`, { params });
  }

  createAccountType(accountTypeDto: CreateAccountTypeDto): Observable<AccountTypeResponse> {
    return this.http.post<AccountTypeResponse>(`${this.apiUrl}/accountType`, accountTypeDto);
  }

  getAllAccountRequests(): Observable<AccountRequestDto[]> {
    return this.http.get<AccountRequestDto[]>(`${this.apiUrl}/accounts/requests`);
  }

  deleteAccountType(accountTypeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/accountType/${accountTypeId}`);
  }

  createAccountRequest(accountRequestDto: CreateAccountRequestDto): Observable<AccountRequestDto> {
    return this.http.post<AccountRequestDto>(`${this.apiUrl}/accounts/requests`, accountRequestDto);
  }

  exchangeTransfer(exchangeTransferDto: ExchangeTransferDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/accounts/exchange`, exchangeTransferDto);
  }

  reviewAccountRequest(requestId: number, isApproved: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/accounts/requests/${requestId}`, isApproved);
  }

  getAccounts(): Observable<AccountDto[]> {
    return this.http.get<AccountDto[]>(`${this.apiUrl}/accounts/my`);
  }

  closeAccount(accountId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/accounts/${accountId}/close`, {});
  }
}
