import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private apiUrl = `${environment.apiUrl}/agencies`;

  constructor(private http: HttpClient) { }

  getAllAgencies(page: number, size: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
    });

    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get(this.apiUrl, { headers, params });
  }

  createAgency(agency: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
    });
    return this.http.post(`${this.apiUrl}`, agency, { headers });
  }

  updateAgency(id: number, agency: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
    });
    return this.http.patch(`${this.apiUrl}/${id}`, agency, { headers });
  }

  deleteAgency(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
    });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }


}
