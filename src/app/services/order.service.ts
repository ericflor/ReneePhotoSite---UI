import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private apiUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) { }

  getAllOrders(page: number = 0, size: number = 10): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(this.apiUrl, { headers, params });
  }

  private getAuthToken(): string {
    return localStorage.getItem('accessToken') || '';
  }

  updateOrder(id: number, orderDetails: Partial<Order>): Observable<Order> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`,
      'Content-Type': 'application/json'
    });

    return this.http.patch<Order>(`${this.apiUrl}/${id}`, orderDetails, { headers });
  }
}
