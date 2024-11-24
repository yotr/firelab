import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css'],
})
export class EditJobComponent implements OnInit {
  addForm: FormGroup;
  currentTheme: any;
  // types
  types: any[] = [];
  typesLoading: boolean = true;
  // reports
  reports: any[] = [];
  reportsLoading: boolean = true;

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
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      type: ['', [Validators.required]],
      date: ['', [Validators.required]],
      jobId: [''],
    });

    this.types = [
      {
        id: 0,
        name: 'Bell',
      },
      {
        id: 1,
        name: 'Door Holder',
      },
      {
        id: 2,
        name: 'Door Lock',
      },
    ];

    this.reports = [
      {
        id: 0,
        name: 'Alarm',
      },
      {
        id: 1,
        name: 'Fire Door',
      },
    ];
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

  submit() {}
}
