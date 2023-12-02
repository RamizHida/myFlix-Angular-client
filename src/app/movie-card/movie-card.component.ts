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
  movies: any[] = [];
  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  // openMoviesDialog(): void {
  //   this.dialog.open(MovieCardComponent, {
  //     width: '500px',
  //   });
  // }

  openGenreDetails(genre: any): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        name: genre.name,
        description: genre.description,
      },
    });
  }

  openDirectorDetails(director: any): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        name: director.name,
        description: director.bio,
      },
    });
  }

  openSynopsisDetails(movie: any) {
    this.dialog.open(MovieInfoComponent, {
      data: {
        name: `${movie.movieTitle}: Plot`,
        description: movie.description,
      },
    });
  }

  addToFavorites(movieID: string): void {
    // prevent same movie from being favored more than once
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.favoriteMovies.includes(movieID)) {
      console.log('i ran also');
      alert('Movie is already Favorited');
      return;
    }
    this.fetchApiData.addMovieToFavorites(movieID).subscribe((data: {}) => {
      this.snackBar.open('Add the following movie to your favorites', 'OK', {
        duration: 1000,
      });
      console.log(data);
    });
  }

  deleteFromFavorites(movieID: string): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // prevent deleting a movie if movie is not in list
    if (!user.favoriteMovies.includes(movieID)) {
      alert('The following movie is not included in your favorites');
      return;
    }
    if (confirm('are you sure you want to delete?')) {
      console.log('yes');
      this.fetchApiData.deleteMovieFromFavorites(movieID).subscribe(() => {
        this.snackBar.open('Deleted the movies from favorites', 'OK', {
          duration: 200,
        });
      });
    } else {
      return console.log('no');
    }
  }
}
