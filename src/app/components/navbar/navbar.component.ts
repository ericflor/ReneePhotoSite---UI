import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  logoUrl = 'assets/logo.jpg';

  constructor(private router: Router, public userService: UserService) { }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/']);
  }

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
}
