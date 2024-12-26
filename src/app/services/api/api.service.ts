import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  currentUser: any = {};

  constructor(private http: HttpClient, private auth: AuthService) {}

  // get user
  isLoggedIn(): boolean {
    return this.auth.currentUserSignal() == undefined ? false : true;
  }
  // get current user data
  getCurrentUserData() {
    if (this.isLoggedIn()) {
      this.currentUser = this.auth.currentUserSignal();
    }
  }

  //get
  get(path: string): Observable<any[] | any> {
    // request
    return this.http.get<any[]>(`${environment.API}/api/${path}`);
    // .pipe(retry(1), catchError(this.handleError));
  }
  // get by id
  getById(path: string, id: any): Observable<any> {
    // request
    return this.http.get<any>(`${environment.API}/api/${path}/${id}`);
    // .pipe(retry(1), catchError(this.handleError));
  }

  // add
  add(path: string, data: any): Observable<any> {
    return this.http.post<any>(
      `${environment.API}/api/${path}`,
      data,
      environment.HTTP_OPTIONS
    );
    // .pipe(retry(1), catchError(this.handleError));
  }

  // update
  update(path: string, id: any, data: any): Observable<any> {
    return this.http.put<any>(
      `${environment.API}/api/${path}/${id}`,
      data,
      environment.HTTP_OPTIONS
    );
    // .pipe(retry(1), catchError(this.handleError));
  }

  // delete

  delete(path: string, id: any): Observable<any> {
    return this.http.delete(`${environment.API}/api/${path}/${id}`);
    // .pipe(retry(1), catchError(this.handleError));
  }

  // add multi data
  addFormData(path: string, data: FormData): Observable<any> {
    return this.http
      .post<any>(
        `${environment.API}/api/${path}`,
        data,
        environment.Files_HTTP_OPTIONS
      )
      .pipe(retry(1), catchError(this.handleError));
    // request
    // const request = new HttpRequest(
    //   'POST',
    //   `${environment.API}/api/${path}`,
    //   data,
    //   {
    //     headers: new HttpHeaders({ 'content-type': 'multipart/form-data' }),
    //     reportProgress: false,
    //     responseType:  'arraybuffer' || 'blob' || 'json' || 'text',
    //   }
    // );
    // return this.http.request(request);
  }

  // update multi data
  updateFormData(path: string, id: any, data: any): Observable<any> {
    return this.http.put<any>(
      `${environment.API}/api/${path}/${id}`,
      data,
      environment.MULTI_HTTP_OPTIONS
    );
    // .pipe(retry(1), catchError(this.handleError));
  }

  // get filtered data
  filterData(
    path: string,
    page: number,
    pageSize: number,
    column?: string,
    operator1?: string,
    operator2?: string,
    value1?: any,
    value2?: any
  ): Observable<any> {
    // request
    if (column) {
      return this.http.get<any>(
        `${environment.API}/api/${path}?column=${column}&value1=${value1}&value2=${value2}&operator1=${operator1}&operator2=${operator2}&page=${page}&pageSize=${pageSize}`
      );
      // .pipe(retry(5), catchError(this.handleError));
    } else {
      return this.http.get<any>(
        `${environment.API}/api/${path}?page=${page}&pageSize=${pageSize}`
      );
      // .pipe(retry(1), catchError(this.handleError));
    }
  }
  // get filtered data
  filterDataWithCustomerId(
    path: string,
    page: number,
    pageSize: number,
    customerId: any,
    column?: string,
    operator1?: string,
    operator2?: string,
    value1?: any,
    value2?: any
  ): Observable<any> {
    // request
    if (column) {
      return this.http.get<any>(
        `${environment.API}/api/${path}?customerId=${customerId}&column=${column}&value1=${value1}&value2=${value2}&operator1=${operator1}&operator2=${operator2}&page=${page}&pageSize=${pageSize}`
      );
      // .pipe(retry(5), catchError(this.handleError));
    } else {
      return this.http.get<any>(
        `${environment.API}/api/${path}?customerId=${customerId}&page=${page}&pageSize=${pageSize}`
      );
      // .pipe(retry(1), catchError(this.handleError));
    }
  }
  //search  globaly or by column
  globalSearchWithCustomerId(
    path: string,
    customerId: any,
    search: any,
    column?: any
  ): Observable<any[] | any> {
    // request
    if (column != null) {
      return this.http.get<any[]>(
        `${environment.API}/api/${path}?customerId=${customerId}&search=${search}&column=${column}`
      );
      // .pipe(retry(5), catchError(this.handleError));
    } else {
      return this.http.get<any[]>(
        `${environment.API}/api/${path}?customerId=${customerId}&search=${search}`
      );
      // .pipe(retry(1), catchError(this.handleError));
    }
  }

  //search  globaly or by column
  globalSearch(
    path: string,
    search: any,
    column?: any
  ): Observable<any[] | any> {
    // request
    if (column != null) {
      return this.http.get<any[]>(
        `${environment.API}/api/${path}?search=${search}&column=${column}`
      );
      // .pipe(retry(5), catchError(this.handleError));
    } else {
      return this.http.get<any[]>(
        `${environment.API}/api/${path}?search=${search}`
      );
      // .pipe(retry(1), catchError(this.handleError));
    }
  }

  statusChange(path: string, data?: any) {
    return this.http.put<any>(
      `${environment.API}/api/${path}`,
      data,
      environment.HTTP_OPTIONS
    );
    // .pipe(retry(1), catchError(this.handleError));
  }

  //handle function error
  private handleError(error: HttpErrorResponse): any {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
