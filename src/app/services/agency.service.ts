import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private apiUrl = 'http://localhost:8080/agencies';

  constructor(private http: HttpClient) { }

  getAllAgencies(page: number = 0, size: number = 10): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
    });

    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get(this.apiUrl, { headers, params });
  }
}
