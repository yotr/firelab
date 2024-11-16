import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //variables
  headers: any;

  currentUserSignal = signal<any | null | undefined>(undefined);

  //variables
  httpOptions;

  constructor(private http: HttpClient, private router: Router) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    // header settings
    this.httpOptions = environment.HTTP_OPTIONS;
  }


  // register function
  login(path: string, data: any): Observable<any> {
    return this.http.post<any>(
      `${environment.API}/api/${path}`,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  logout() {
    // get user if exist
    let isLoggedIn = localStorage.getItem('firelab-loginData');

    if (isLoggedIn) {
      // remove uset from storage
      localStorage.removeItem('firelab-loginData');
      // make current user signal undefined
      this.currentUserSignal.set(undefined);
      // navigate to login page
      this.router.navigate(['/login']);
    } else {
      // navigate to login page
      this.router.navigate(['/login']);
    }
  }
}
