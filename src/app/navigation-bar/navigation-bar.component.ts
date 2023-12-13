import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
})
export class NavigationBarComponent {
  constructor(private router: Router) {}
  ngOnInit(): void {}

  /**
   * Function that routes to user profile page view
   */
  goToProfile() {
    this.router.navigate(['profile']);
  }

  /**
   * Function that routes to movie page view
   */
  goToMovies() {
    this.router.navigate(['movies']);
  }

  /**
   * Function that checks whether a user is currently logged in
   */
  currentlyLoggedIn() {
    return localStorage.getItem('user');
  }

  /**
   * Function responsible for logging out a user
   */
  logout() {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
