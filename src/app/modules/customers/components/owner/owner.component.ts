import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Params, Router } from '@angular/router';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css'],
})
export class OwnerComponent implements OnInit {
  id: any = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    //get id
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('id')) {
        this.id = paramMap['get']('id');
      }
    });
    // add id
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/home')) {
          this.router.navigate(['/modules/customers/home'], {
            queryParams: { id: this.id },
          });
        } else if (event.url.includes('/customerInfo')) {
          this.router.navigate(['/modules/customers/customerInfo'], {
            queryParams: { id: this.id },
          });
        }
      }
    });
  }

  ngOnInit() {}
}
