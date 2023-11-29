import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { LoginRequest } from '../models/login-request.model';
import { UserRegistrationDto } from '../models/user-registration-dto.model';
import { JwtAuthenticationResponse } from '../models/jwt-authentication-response.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  registerUser(user: UserRegistrationDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  authenticateUser(loginRequest: LoginRequest): Observable<JwtAuthenticationResponse> {
    return this.http.post<JwtAuthenticationResponse>(`${this.apiUrl}/authenticate`, loginRequest);
  }

  findUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/find/${username}`);
  }

  getUserIdByUsername(username: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/find/${username}`);
  }
}
