import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.css'],
})
export class UserDropdownComponent implements OnInit {
  user: any = null;
  userImage: any = null;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.getCurrentUserData();
  }

  // get user
  isLoggedIn(): any {
    return this.auth.currentUserSignal() == undefined ? false : true;
  }

  getCurrentUserData() {
    if (this.isLoggedIn()) {
      // check local storage
      let user = localStorage.getItem('firelab-loginData');
      // if exist
      if (user) {
        this.auth.currentUserSignal.set(JSON.parse(user));
        let currentUser = this.auth.currentUserSignal()?.userData;
        this.user = currentUser;
        this.userImage = 'assets/img/user.jpg';
      }
    } else {
      this.userImage = 'assets/img/user.jpg';
    }
  }
  //logout
  Logout() {
    this.auth.logout();
  }
}
