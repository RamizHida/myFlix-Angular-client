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

  /**
   * Function responsible for making API call to register a user
   * @param userDetails
   * @returns
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails, {
        responseType: 'text',
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Function responsible for making API call to loggin a user
   * @param userCredentials
   * @returns
   */
  public userLogin(userCredentials: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login', userCredentials)
      .pipe(catchError(this.handleError));
  }

  /**
   * Function responsible for getting token needed for access API endpoints
   * @returns A string representation of the token
   */
  getToken() {
    return JSON.stringify(localStorage.getItem('token'));
  }

  /**
   * Function responsible for making API call to get all
   * available movies
   * @returns
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Function responsible for making API call to get a single movie
   * @param titleOfMovie
   * @returns
   */
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

  /**
   * Function responsible for making API call to get director info
   * @param nameOfDirector
   * @returns
   */
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

  /**
   * Funtction responsible for making API call to genre info
   * @param nameOfGenre
   * @returns
   */
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

  /**
   * Function responsible for making API call to get info on a single user
   * @param userID
   * @returns
   */
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

  /**
   * Function responsible for making API call to add a single
   * movie to a user's list of favorite movies
   * @param movieID
   * @returns
   */
  addMovieToFavorites(movieID: string): Observable<any> | any {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    user.favoriteMovies.push(movieID);
    localStorage.setItem('user', JSON.stringify(user));

    return this.http
      .post(apiUrl + `users/${user.userName}/movies/${movieID}`, null, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Function responsible for making API call to edit
   * user information
   * @param editedUser user object which contains the new user info
   * @returns
   */
  editUser(editedUser: any): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return this.http
      .put(apiUrl + `users/${user.userName}`, editedUser, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Function responsible for making API call to delete
   * a user's account
   * @param username
   * @returns
   */
  deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    // const user = JSON.parse(localStorage.getItem('user') || '{}');

    // const token = this.getToken();
    return this.http
      .delete(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text',
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Function responsible for making the API call to remove
   * a movie from a user's list of favorite movies
   * @param movieID
   * @returns
   */
  deleteMovieFromFavorites(movieID: string): Observable<any> | any {
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

  /**
   * Function responsible for handling errors when making
   * any API calls
   * @param error
   * @returns
   */
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
