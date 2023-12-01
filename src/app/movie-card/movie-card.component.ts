import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog
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
}
