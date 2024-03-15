import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
