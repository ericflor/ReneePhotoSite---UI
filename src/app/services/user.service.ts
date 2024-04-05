import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/loginRequest';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) { }

  authenticateUser(loginRequest: LoginRequest): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(this.apiUrl, loginRequest, httpOptions);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}
