import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;

@Component({
  selector: 'app-building-info',
  templateUrl: './building-info.component.html',
  styleUrls: ['./building-info.component.css'],
})
export class BuildingInfoComponent implements OnInit {
  currentTheme: any;
  deleteId: any = null;
  editId: any = null;
  updatedData: any = null;

  customerId: any = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
    private themeService: ThemeService
  ) {
    //get id
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('customerId')) {
        this.customerId = paramMap['get']('customerId');
        // activate current customer id so we can get in other pages after refresh
        this.sidebarService.sendCurrentCustomer(paramMap['get']('customerId'));
      }
    });
  }
  ngOnInit() {
    this.getTheme();
    this.getCurrentCustomerId();
    this.navigationHandler();
  }
  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
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
  navigate(id: any) {
    this.router.navigate(['/modules/customers/buildingInfo/edit', id], {
      queryParams: { customerId: this.customerId },
    });
  }
  deleteItem() {}
  addItem() {}
  updateItem(id: any) {
    // this.editId = id;
    // this.updatedData = {
    //   title: 'test',
    //   description: 'testing',
    // };
    // $('#edit_building_info_modal').modal('show');
  }
}
