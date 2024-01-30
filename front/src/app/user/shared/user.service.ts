import { HttpClient, HttpEvent, HttpRequest, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Token } from './token.model';
import { User } from './user.model';
import { LoginDto, RegisterDto, RegisterWorkerDto, SuccessLoginDto, UpdateUserDto, UserDisplayDto, UserDto } from 'src/app/Shared/models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  searchWorkers(searchTerm?: string, sortField?: string, ascending?: boolean): Observable<UserDisplayDto[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.append('searchTerm', searchTerm);
    if (sortField) params = params.append('sortField', sortField);
    if (ascending !== undefined) params = params.append('ascending', ascending.toString());

    return this.http.get<UserDisplayDto[]>(`${this.apiUrl}/users/searchAndSort`, { params });
  }

  getUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/users`);
  }

  login(loginDto: LoginDto): Observable<SuccessLoginDto> {
    return this.http.post<SuccessLoginDto>(`${this.apiUrl}/users/login`, loginDto);
  }

  addUser(registerDto: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, registerDto);
  }

  updateUser(updateUserDto: UpdateUserDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/users`, updateUserDto);
  }

  getAllWorkers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/users/workers`);
  }

  addWorker(dto: RegisterWorkerDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/workers`, dto);
  }

  deleteWorker(username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/worker/${username}`, { responseType: 'text' });
  }
}
