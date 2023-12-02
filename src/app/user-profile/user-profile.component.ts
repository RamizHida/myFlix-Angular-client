import { Component, OnInit, Input } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  constructor(
    public fetchApiData: UserRegistrationService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  // where current user will be stored
  user: any = {};

  ngOnInit(): void {
    // if user currently logged on, set the user to user object
    if (localStorage.getItem('user')) {
      this.user = localStorage.getItem('user');
    }
    // if no user logged on, navigate to home page
    else {
      this.router.navigate(['welcome']);
    }
  }
}
