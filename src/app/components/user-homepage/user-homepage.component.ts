import { Component, OnInit } from '@angular/core';
import { PhotoService } from 'src/app/services/photo.service';
import { Photo } from 'src/app/models/photo.model'; // Adjust the import path as necessary

@Component({
  selector: 'app-user-homepage',
  templateUrl: './user-homepage.component.html',
  styleUrls: ['./user-homepage.component.css']
})
export class UserHomepageComponent implements OnInit {
  photos: Photo[] = [];

  constructor(private photoService: PhotoService) {}

  ngOnInit(): void {
    const userId = this.getUserIdFromToken();
    this.fetchPhotos(userId);
  }

  fetchPhotos(userId: number): void {
    this.photoService.getPhotosByUserId(userId).subscribe(
      (photos) => this.photos = photos,
      (error) => console.error(error)
    );
  }

  private getUserIdFromToken(): number {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("User ID: " + parseInt(payload.sub, 10))
      return parseInt(payload.sub, 10);
    }
    return 0;
  }

  getPhotoUrl(photo: Photo): string {
    // Check if 'photo.photo' is a base64 string.
    if (photo.photo && typeof photo.photo === 'string') {
      return `data:image/jpeg;base64,${photo.photo}`;
    }
    return 'path/to/default/image.jpg'; // Replace with a default image path if necessary
  }

}
