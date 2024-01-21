import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Token } from './token.model';
import { User } from './user.model';
import { LoginDto, RegisterDto, SuccessLoginDto, UpdateUserDto, UserDto } from 'src/app/Shared/models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

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

  addWorker(registerDto: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/workers`, registerDto);
  }

  deleteWorker(username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/worker/${username}`);
  }
}
