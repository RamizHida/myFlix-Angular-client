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

  goToProfile() {
    this.router.navigate(['profile']);
  }

  goToMovies() {
    this.router.navigate(['movies']);
  }

  currentlyLoggedIn() {
    return localStorage.getItem('user');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
