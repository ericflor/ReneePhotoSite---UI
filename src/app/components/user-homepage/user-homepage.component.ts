import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-homepage',
  templateUrl: './user-homepage.component.html',
  styleUrls: ['./user-homepage.component.css']
})
export class UserHomepageComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    const userId = this.getUserIdFromToken();
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

}
