// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HttpHeaders } from '@angular/common/http';

export const environment = {
  production: false,
  API: 'http://localhost:5158',

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

