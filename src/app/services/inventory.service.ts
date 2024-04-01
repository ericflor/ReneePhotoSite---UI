import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Phone } from '../models/phone';
import { PaginatedResponse } from '../models/paginatedResponse';

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

  addPhonesBatch(phones: Phone[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getAuthToken()}`,
    });

    return this.http.post(`${this.apiUrl}/batch`, phones, { headers });
  }

  updatePhone(imei: string, phoneDetails: Phone): Observable<Phone> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getAuthToken()}`
    });
    console.log('PHONE DETAILS: ' + phoneDetails.employee);
    return this.http.patch<Phone>(`${this.apiUrl}/${imei}`, phoneDetails, {
      headers,
    });
  }

  updatePhonesBatch(phones: any[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getAuthToken()}`,
    });

    return this.http.patch(`${this.apiUrl}/batch`, phones, { headers });
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

    const params = new HttpParams().set('page', '0').set('size', '1000000000');

    return this.http.get(this.apiUrl, { headers, params });
  }

  fetchAllInventory(): Observable<PaginatedResponse<Phone>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthToken()}`,
    });

    const params = new HttpParams()
      .set('page', '0')
      .set('size', '1000000000'); // Set this to a value you're sure will cover all records

    return this.http.get<PaginatedResponse<Phone>>(this.apiUrl, { headers, params });
  }

}
