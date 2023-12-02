import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://myflixdbrender.onrender.com/';

@Injectable({
  providedIn: 'root',
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails, {
        responseType: 'text',
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  // Making the api call for the user login endpoint
  public userLogin(userCredentials: any): Observable<any> {
    console.log(userCredentials);
    return this.http
      .post(apiUrl + 'login', userCredentials)
      .pipe(catchError(this.handleError));
  }

  getToken() {
    return JSON.stringify(localStorage.getItem('token'));
  }

  // Making the api call for the get all movies endpoint
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('my token iss,', token);
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get one movie endpoint
  getOneMovie(titleOfMovie: string): Observable<any> {
    const token = this.getToken();
    return this.http
      .get(apiUrl + 'movies/' + titleOfMovie, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get director endpint
  getDirector(nameOfDirector: string): Observable<any> {
    const token = this.getToken();
    return this.http
      .get(apiUrl + 'movies/directors/' + nameOfDirector, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get genre endpint
  getGenre(nameOfGenre: string): Observable<any> {
    const token = this.getToken();
    return this.http
      .get(apiUrl + 'movies/genres/' + nameOfGenre, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get single user endpint
  getUser(userID: number): Observable<any> {
    const token = this.getToken();
    return this.http
      .get(apiUrl + 'users/' + userID, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // This endpoint was never definded in the API
  // Making the api call for the get favorite movies for a user endpint
  // getFavoriteMovies(userName: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http
  //     .get(apiUrl + 'movies/users/' + userName, {
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + token,
  //       }),
  //     })
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }

  // Making the api call for the add a movie to favorite movies list endpint
  addMovieToFavorites(movieID: string): Observable<any> | any {
    // const token = this.getToken();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // console.log('here', user.favoriteMovies.includes(movieID));

    // if (user.favoriteMovies.includes(movieID)) {
    //   console.log('i ran');
    //   alert('Movie is already Favorited');
    //   return;
    // }

    user.favoriteMovies.push(movieID);
    localStorage.setItem('user', JSON.stringify(user));

    return this.http
      .post(apiUrl + `users/${user.userName}/movies/${movieID}`, null, {
        headers: new HttpHeaders({
          // 'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the edit a user endpoint
  // Must send a updated object with this API request (editedUser)
  editUser(editedUser: any): Observable<any> {
    const token = this.getToken();
    return this.http
      .put(
        apiUrl + `users/${JSON.parse(localStorage.getItem('user') || '').name}`,
        editedUser,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the delete a user endpoint
  deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // const token = this.getToken();
    return this.http
      .delete(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the delete a movie from the favorite movies list endpoint
  deleteMovieFromFavorites(movieID: string): Observable<any> | any {
    // const token = this.getToken();
    const token = localStorage.getItem('token');
    let user = JSON.parse(localStorage.getItem('user') || '{}');

    for (let i = 0; i < user.favoriteMovies.length; i++) {
      if (user.favoriteMovies[i] === movieID) {
        user.favoriteMovies.splice(user.favoriteMovies[i], 1);
      }
    }

    localStorage.setItem('user', JSON.stringify(user));
    return this.http
      .delete(apiUrl + `users/${user.userName}/movies/${movieID}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
      console.log(error.error);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
