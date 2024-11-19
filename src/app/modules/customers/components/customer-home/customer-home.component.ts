import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css'],
})
export class CustomerHomeComponent implements OnInit {
  percentages: any[] = [];
  acount_types: any[] = [];
  pricing_levels: any[] = [];
  inspectionsDue: any[] = [];
  inspectionsDone: any[] = [];
  inspectionsDueKeys: any[] = [];
  inspectionsDoneKeys: any[] = [];
  inspectionsDueLoading: boolean = false;
  inspectionsDoneLoading: boolean = false;

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
        if (event.url.includes('/customerInfo')) {
          this.router.navigate(['/modules/customers/customerInfo'], {
            queryParams: { id: this.id },
          });
        } else if (event.url.includes('/owner')) {
          this.router.navigate(['/modules/customers/owner'], {
            queryParams: { id: this.id },
          });
        }
      }
    });
    this.acount_types = ['master', 'sub', 'building'];
    this.inspectionsDueKeys = [
      {
        name: 'category',
        display: 'Category',
        type: 'string',
        active: true,
      },
      {
        name: 'frequency',
        display: 'Frequency',
        type: 'string',
        active: true,
      },
      {
        name: 'month',
        display: 'Month',
        type: 'string',
        active: true,
      },
      {
        name: 'pendingDue',
        display: 'Pending Due',
        type: 'string',
        active: true,
      },
      {
        name: 'tasks',
        display: 'Tasks',
        type: 'boolean',
        active: true,
      },
    ];
    this.inspectionsDoneKeys = [
      {
        name: 'category',
        display: 'Category',
        type: 'string',
        active: true,
      },
      {
        name: 'frequency',
        display: 'Frequency',
        type: 'string',
        active: true,
      },
      {
        name: 'month',
        display: 'Month',
        type: 'string',
        active: true,
      },
      {
        name: 'done',
        display: 'Done',
        type: 'string',
        active: true,
      },
      {
        name: 'tasks',
        display: 'Tasks',
        type: 'boolean',
        active: true,
      },
    ];
  }

  ngOnInit() {}
}
