import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // return next.handle(request);
    // Retrieve the token from a service or storage
    let user: any = localStorage.getItem('user');
    const token: string = JSON.parse(user)?.token;
    // console.log(token);
    // const token = 'YOUR_ACCESS_TOKEN_HERE';

    // Clone the request and add the new header
    const authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Pass the cloned request with the new header
    return next.handle(authReq);
  }
}
