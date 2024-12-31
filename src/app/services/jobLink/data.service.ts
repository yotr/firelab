import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // events: any[] = [
  //   {
  //     id: '1',
  //     start: DayPilot.Date.today().addHours(10),
  //     end: DayPilot.Date.today().addHours(12),
  //     text: 'Event 1 \n ibrahim abdelrahman',
  //   },
  // ];

  constructor(private http: HttpClient) {}

  getEvents(
    path: string,
    from: DayPilot.Date,
    to: DayPilot.Date
  ): Observable<any[]> {
    // request
    return this.http.get<any[]>(`${environment.API}/api/${path}?startDate=${from.toString()}&endDate=${to.toString()}`);
    // simulating an HTTP request
    // return new Observable((observer) => {
    //   setTimeout(() => {
    //     observer.next(this.events);
    //   }, 200);
    // });

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString());
  }
}
