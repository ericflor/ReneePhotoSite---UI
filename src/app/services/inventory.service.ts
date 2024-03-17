import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Phone } from '../models/phone';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:8080/inventory';

  constructor(private http: HttpClient) { }

  getAllPhones(page: number = 0, size: number = 10): Observable<any> { // Adjust the return type based on your data model
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    // Create HttpParams with page and size
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(this.apiUrl, { headers, params });
  }

  private getAuthToken(): string {
    return localStorage.getItem('accessToken') || '';
  }

  addPhonesBatch(phones: any[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.post(`${this.apiUrl}/batch`, phones, { headers });
  }

  updatePhone(imei: string, phoneDetails: Phone): Observable<Phone> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });
    console.log("PHONE DETAILS: " + phoneDetails.employee);
    return this.http.patch<Phone>(`${this.apiUrl}/${imei}`, phoneDetails, { headers });
  }
}
