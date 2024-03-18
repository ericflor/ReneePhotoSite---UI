import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Phone } from '../models/phone';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = 'http://localhost:8080/inventory';

  constructor(private http: HttpClient) {}

  getAllPhones(page: number, size: number): Observable<any> {
    // Adjust the return type based on your data model
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthToken()}`,
    });

    // Create HttpParams with page and size
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(this.apiUrl, { headers, params });
  }

  addPhonesBatch(phones: any[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getAuthToken()}`,
    });

    return this.http.post(`${this.apiUrl}/batch`, phones, { headers });
  }

  updatePhone(imei: string, phoneDetails: Phone): Observable<Phone> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getAuthToken()}`,
    });
    console.log('PHONE DETAILS: ' + phoneDetails.employee);
    return this.http.patch<Phone>(`${this.apiUrl}/${imei}`, phoneDetails, {
      headers,
    });
  }

  deletePhone(imei: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthToken()}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete(`${this.apiUrl}/${imei}`, { headers });
  }

  private getAuthToken(): string {
    return localStorage.getItem('accessToken') || '';
  }

  fetchAllForDropdowns(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthToken()}`,
    });

    const params = new HttpParams().set('size', '100000000');

    return this.http.get(this.apiUrl, { headers, params });
  }

}
