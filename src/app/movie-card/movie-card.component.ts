import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  /**
   * Array where all movies will be housed
   */
  movies: any[] = [];

  /**
   * Array where user's favorite movies will be housed
   */
  favoriteMovieList: any[] = [];

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Function that returns all movies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  /**
   * Function that displays genres information
   * @param genre a genre object
   */
  openGenreDetails(genre: any): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        name: genre.name,
        description: genre.description,
      },
    });
  }

  /**
   * Function that displays director information
   * @param director a director object
   */
  openDirectorDetails(director: any): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        name: director.name,
        description: director.bio,
      },
    });
  }

  /**
   * Function that opens movie information
   * @param movie a movie object
   */
  openSynopsisDetails(movie: any) {
    this.dialog.open(MovieInfoComponent, {
      data: {
        name: `${movie.movieTitle}: Plot`,
        description: movie.description,
      },
    });
  }

  /**
   * Function that adds a movie to a user's favorite list
   * @param movieID the id of the chosen movie to add
   */
  addToFavorites(movieID: string): void {
    // prevent same movie from being favored more than once
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.favoriteMovies.includes(movieID)) {
      alert('Movie is already Favorited');
      return;
    }

    this.fetchApiData.addMovieToFavorites(movieID).subscribe((data: {}) => {
      this.snackBar.open('Add the following movie to your favorites', 'OK', {
        duration: 1000,
      });
    });
  }

  /**
   * Function that removes a movie from a user's favorite list
   * @param movieID the id of the chosen movie to remove
   */
  deleteFromFavorites(movieID: string): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // prevent deleting a movie if movie is not in list
    if (!user.favoriteMovies.includes(movieID)) {
      alert('The following movie is not included in your favorites');
      return;
    }

    // this.isAFavoriteMovie(movieID);
    if (confirm('are you sure you want to delete?')) {
      this.fetchApiData.deleteMovieFromFavorites(movieID).subscribe(() => {
        this.snackBar.open('Deleted the movies from favorites', 'OK', {
          duration: 200,
        });
      });
    } else {
      return;
    }
  }

  /**
   * Function that verifies if a movie is included in a user's favorite list
   * @param movieID the id of the chosen movie
   */
  isAFavoriteMovie(movieId: string) {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.favoriteMovies.includes(movieId);
  }
}
