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
  @Input() userData = {
    userName: JSON.parse(localStorage.getItem('user') || '{}').userName,
    password: '',
    userEmail: JSON.parse(localStorage.getItem('user') || '{}').userEmail,
    BirthDate: JSON.parse(localStorage.getItem('user') || '{}').BirthDate,
  };

  // @Input() userData = {
  //   userName: '',
  //   password: '',
  //   userEmail: '',
  //   BirthDate: '',
  // };

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

  updateProfileInfo() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('bday: ', this.userData.BirthDate);
    console.log(typeof this.userData.BirthDate);
    console.log(this.userData.BirthDate.length);
    console.log('i am userdata', this.userData);
    console.log('i am current user', user.userName);
    console.log(typeof user.userName);
    this.fetchApiData.editUser(this.userData).subscribe((response) => {
      console.log(response);
      localStorage.setItem('user', JSON.stringify(response));
      this.snackBar.open('user info updated successfully!', 'OK', {
        duration: 2000,
      });
    });
  }

  deleteUserAccount() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (confirm('Would you like to proceed to account deletion?')) {
      this.fetchApiData.deleteUser(user.userName).subscribe((res) => {
        console.log(res);
        localStorage.clear();
      });
    }
    this.snackBar.open('user info deleted successfully!', 'OK', {
      duration: 2000,
    });
    // navigate to home page
    this.router.navigate(['welcome']);
  }
}
