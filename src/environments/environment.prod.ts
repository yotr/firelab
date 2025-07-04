import { HttpHeaders } from '@angular/common/http';
export const environment = {
  production: false,
  API: 'test',

  HTTP_OPTIONS: {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  },
  MULTI_HTTP_OPTIONS: {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      // 'Content-Type':
      //   'multipart/form-data; boundary=---WebKitFormBoundary7MA4YWxkTrZu0gW',
      // 'content-type': 'application/x-www-form-urlencoded',
      // Accept: '*/*',
      // Authorization: 'my-auth-token',
    }),
  },
};
