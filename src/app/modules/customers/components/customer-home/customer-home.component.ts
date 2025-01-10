import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
    private sidebarService: SidebarService,
    public translateService: TranslateService
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
        display: this.translateService.instant(
          'customers.home.tables.category'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'frequency',
        display: this.translateService.instant(
          'customers.home.tables.frequency'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'month',
        display: this.translateService.instant('customers.home.tables.month'),
        type: 'string',
        active: true,
      },
      {
        name: 'pendingDue',
        display: this.translateService.instant(
          'customers.home.tables.pendingDue'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'tasks',
        display: this.translateService.instant('customers.home.tables.tasks'),
        type: 'boolean',
        active: true,
      },
    ];
    this.inspectionsDoneKeys = [
      {
        name: 'category',
        display: this.translateService.instant(
          'customers.home.tables.category'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'frequency',
        display: this.translateService.instant(
          'customers.home.tables.frequency'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'month',
        display: this.translateService.instant('customers.home.tables.month'),
        type: 'string',
        active: true,
      },
      {
        name: 'done',
        display: this.translateService.instant('customers.home.tables.done'),
        type: 'string',
        active: true,
      },
      {
        name: 'tasks',
        display: this.translateService.instant('customers.home.tables.tasks'),
        type: 'boolean',
        active: true,
      },
    ];
  }

  ngOnInit() {
    this.getCurrentCustomerId();
    // this.navigationHandler();
  }
  //handle display submenu from list menu array by know which item active
  setActiveMenu() {
    this.sidebarService.activateDropdown('1');
  }
  getCurrentCustomerId() {
    this.sidebarService.getCurrentCustomerValue().subscribe((value: any) => {
      if (value) {
        this.customerId = value;
      }
    });
    if (this.customerId != null) {
      this.setActiveMenu();
      // set querys to current page
      this.router.navigate([], {
        queryParams: { customerId: this.customerId },
      });
    } else {
      this.router.navigate(['/modules/customers/allCustomers']);
    }
  }
}
