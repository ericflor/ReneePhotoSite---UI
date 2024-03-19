import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  {
  constructor(public router: Router) {}

  canActivate(): boolean {
    if (!localStorage.getItem('accessToken')) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  // Decode JWT token and return roles
  getUserRoles(): string[] {
    const token = localStorage.getItem('accessToken');
    if (!token) return [];

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.roles || [];
  }

  // Check if the user has a specific role
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }
}
