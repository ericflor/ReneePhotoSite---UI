import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router) { }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    // Implement logout logic here
    // For example, removing the token from localStorage
    localStorage.removeItem('accessToken');
    this.router.navigate(['/']); // Navigate to home page after logout
  }
}
