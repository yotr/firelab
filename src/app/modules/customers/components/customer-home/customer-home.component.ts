import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';

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

  customerId: any = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService
  ) {
    //get id
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('customerId')) {
        this.customerId = paramMap['get']('customerId');
        // activate current customer id so we can get in other pages after refresh
        this.sidebarService.sendCurrentCustomer(paramMap['get']('customerId'));
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

  ngOnInit() {
    this.getCurrentCustomerId();
    this.navigationHandler();
  }
  //handle display submenu from list menu array by know which item active
  setActiveMenu() {
    this.sidebarService.activateDropdown('customers');
  }
  getCurrentCustomerId() {
    this.sidebarService.getCurrentCustomerValue().subscribe((value: any) => {
      if (value) {
        this.customerId = value;
      }
    });
    this.setActiveMenu();
    // set querys to current page
    this.router.navigate([], {
      queryParams: { customerId: this.customerId },
    });
  }
  navigationHandler() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (
          event.url.includes('/customers/home') ||
          event.url.includes('/customers/owner') ||
          event.url.includes('/customers/customerInfo') ||
          event.url.includes('/customers/buildingInfo') ||
          event.url.includes('/customers/systemInfo')
        ) {
          this.getCurrentCustomerId();
        }
      }
    });
  }
}
