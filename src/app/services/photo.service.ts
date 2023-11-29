import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo.model';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private apiUrl = 'http://localhost:8080/photos';

  constructor(private http: HttpClient) { }

  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.apiUrl);
  }

  getPhoto(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.apiUrl}/${id}`);
  }

  addPhoto(photo: Photo): Observable<Photo> {
    return this.http.post<Photo>(this.apiUrl, photo);
  }

  updatePhoto(id: number, photo: Photo): Observable<Photo> {
    return this.http.put<Photo>(`${this.apiUrl}/${id}`, photo);
  }

  deletePhoto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPhotosByUserId(userId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}/user/${userId}`);
  }

  addMultiplePhotos(photos: Photo[]): Observable<Photo[]> {
    return this.http.post<Photo[]>(`${this.apiUrl}/bulk`, photos);
  }

  addMultiplePhotosForUser(userId: number, photos: Photo[]): Observable<Photo[]> {
    return this.http.post<Photo[]>(`${this.apiUrl}/bulk/user/${userId}`, photos);
  }

  associateMultiplePhotosToUser(userId: number, photoIds: number[]): Observable<Photo[]> {
    return this.http.put<Photo[]>(`${this.apiUrl}/bulk/associate/user/${userId}`, photoIds);
  }

}
