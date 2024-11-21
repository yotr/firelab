import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;

@Component({
  selector: 'app-auto-email',
  templateUrl: './auto-email.component.html',
  styleUrls: ['./auto-email.component.css'],
})
export class AutoEmailComponent implements OnInit {
  addForm: FormGroup;
  currentTheme: any;
  deleteId: any = null;
  editId: any = null;
  updatedData: any = null;

  customerId: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
    private themeService: ThemeService,
    private toastr: ToastrService
  ) {
    //get id
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('customerId')) {
        this.customerId = paramMap['get']('customerId');
        // activate current customer id so we can get in other pages after refresh
        this.sidebarService.sendCurrentCustomer(paramMap['get']('customerId'));
      }
    });

    // Add form
    this.addForm = this.formBuilder.group({
      // emails
      emails: this.formBuilder.array([]),
    });
  }
  ngOnInit() {
    this.getTheme();
    this.getCurrentCustomerId();
  }
  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }
  //handle display submenu from list menu array by know which item active
  setActiveMenu() {
    this.sidebarService.activateDropdown('Customers');
  }
  getCurrentCustomerId() {
    this.sidebarService.getCurrentCustomerValue().subscribe((value: any) => {
      if (value) {
        this.customerId = value;
      }
    });
    this.setActiveMenu();
    // set querys to current page
    // this.router.navigate([], {
    //   queryParams: { customerId: this.customerId },
    // });
  }
  // navigationHandler() {
  //   this.router.events.subscribe((event: Event) => {
  //     if (event instanceof NavigationEnd) {
  //       if (
  //         event.url.includes('/customers/home') ||
  //         event.url.includes('/customers/owner') ||
  //         event.url.includes('/customers/customerInfo') ||
  //         event.url.includes('/customers/buildingInfo') ||
  //         event.url.includes('/customers/systemInfo')
  //       ) {
  //         this.getCurrentCustomerId();
  //       }
  //     }
  //   });
  // }
  get emails(): FormArray {
    return this.addForm.get('emails') as FormArray;
  }

  newItem(): FormGroup {
    return this.formBuilder.group({
      email: '',
    });
  }

  addEmailItem() {
    this.emails.push(this.newItem());
  }
  //removing rows from table
  removeEmailItems(i: any) {
    this.emails.removeAt(i);
  }

  deleteItem() {}
  submit() {}
}
