import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient, private router: Router) {}

  getLocations(path: string): Observable<any> {
    return this.http.get<any[]>(`${environment.API}/api/${path}`);
  }

  updateLocation(path: string, id: any, data: any): Observable<any> {
    return this.http
      .put(
        `${environment.API}/api/${path}/${id}`,
        data,
        environment.HTTP_OPTIONS
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  //handle function error
  public handleError(error: HttpErrorResponse): any {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else if (error.status === 401) {
      // Handle Unauthorized error

      localStorage.removeItem('mms-loginData');
      localStorage.removeItem('mms-roles');
      // }
      window.location.reload();

      // Navigate to login page
      this.router.navigate(['/login']);
    } else {
      // Handle other backend errors
      console.error(
        `Backend returned code ${error.status}, body was:`,
        error.error
      );

      var errorMessage = `${error?.error[0].message}`;
      throwError(() => new Error(errorMessage));
    }
    // Return an observable with a user-facing error message
    var errorMessage = `${error?.error[0].message}`;
    if (error?.error[0]?.message) {
      return throwError(() => new Error(errorMessage));
    } else {
    }
    return throwError(() => new Error(error?.error));
  }
}
