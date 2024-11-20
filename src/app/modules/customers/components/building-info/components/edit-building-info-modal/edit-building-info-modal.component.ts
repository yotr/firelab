import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';

@Component({
  selector: 'app-edit-building-info-modal',
  templateUrl: './edit-building-info-modal.component.html',
  styleUrls: ['./edit-building-info-modal.component.css'],
})
export class EditBuildingInfoModalComponent implements OnInit {
  @Output() onAdd: EventEmitter<any> = new EventEmitter();
  editForm: FormGroup;
  customerId: any = null;

  constructor(
    private formBuilder: FormBuilder,
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
    // update form
    this.editForm = this.formBuilder.group({
      // customer
      title: ['', [Validators.required]],
      description: [''],
    });
  }

  ngOnInit() {
    this.getCurrentCustomerId();
    this.navigationHandler();
    this.getCurrentDate();
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

  getCurrentDate() {
    this.editForm.patchValue({
      title: 'test',
      description: 'testing',
    });
  }

  // on attach files to be uploaded
  onSubmit() {
    this.onAdd.emit();
  }
}
