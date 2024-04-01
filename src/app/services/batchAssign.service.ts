import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BatchAssign } from '../models/batchAssign';
import { BatchAssignCreateRequest } from '../models/batchAssignCreateRequest';

@Injectable({
  providedIn: 'root'
})

export class BatchAssignService {
  private apiUrl = 'http://localhost:8080/assign';

  constructor(private http: HttpClient) { }

  createBatchAssign(batchAssign: BatchAssignCreateRequest): Observable<BatchAssign> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getAuthToken()}`
    });

    return this.http.post<BatchAssign>(this.apiUrl, batchAssign, { headers });
  }

  getAllBatchAssigns(page: number, size: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(`${this.apiUrl}`, { headers, params });
  }

  getBatchAssignById(id: number): Observable<BatchAssign>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getAuthToken()}`
    });

    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }


  private getAuthToken(): string {
    return localStorage.getItem('accessToken') || '';
  }
}
