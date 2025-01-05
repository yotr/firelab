import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getLocations(path: string): Observable<any> {
    return this.http.get<any[]>(`${environment.API}/api/${path}`);
  }

  updateLocation(path: string, id: any, data: any): Observable<any> {
    return this.http.put(
      `${environment.API}/api/${path}/${id}`,
      data,
      environment.HTTP_OPTIONS
    );
  }
}
