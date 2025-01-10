import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css'],
})
export class CustomerInfoComponent implements OnInit, AfterViewInit {
  currentTheme: any;
  editForm: FormGroup;
  data: any = {};
  loading: boolean = true;
  currentLanguage: any = localStorage.getItem('lang');
  customerId: any = null;
  uploading: boolean = false;

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
    private formBuilder: FormBuilder,
    private apiService: ApiService
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
      businessName: ['', [Validators.required]],
      contactName: [''],
      email: ['', [Validators.email]],
      cellPhone: [''],
      officePhone: [''],
      contactFaxNumber: [''],
      idAccount: [''],
      address1: [''],
      address2: [''],
      postalCode: [''],
      city: [''],
      // owner
      ownerBusinessName: ['', [Validators.required]],
      ownerContactName: [''],
      ownerEmail: ['', [Validators.email]],
      ownerCellPhone: [''],
      ownerOfficePhone: [''],
      ownerContactFaxNumber: [''],
      ownerId: [''],
      ownerAddress1: [''],
      ownerAddress2: [''],
      ownerPostalCode: [''],
      ownerCity: [''],
    });
  }

  // convenience getter for easy access to form fields
  get formValues() {
    return this.editForm.controls;
  }

  ngAfterViewInit(): void {
    this.getCurrentData();
  }

  ngOnInit() {
    this.getTheme();
    this.getCurrentLanguage();
    this.getCurrentCustomerId();
  }
  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  getCurrentLanguage() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language: any) => {
      this.currentLanguage = language;
      // turn on current language (trandlate)
      this.translateService.use(this.currentLanguage);
    });
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

  // get current data
  getCurrentData() {
    this.apiService.getById('customers', this.customerId).subscribe({
      next: (data: any) => {
        //  set values
        console.log(data);
        this.editForm.patchValue({
          // customer
          businessName: data?.value?.businessName,
          contactName: data?.value?.contactName,
          email: data?.value?.email,
          cellPhone: data?.value?.cellPhone,
          officePhone: data?.value?.officePhone,
          contactFaxNumber: data?.value?.contactFaxNumber,
          idAccount: data?.value?.idAccount,
          address1: data?.value?.address1,
          address2: data?.value?.address2,
          postalCode: data?.value?.postalCode,
          city: data?.value?.city,
          // owner
          ownerBusinessName: data?.value?.ownerBusinessName,
          ownerContactName: data?.value?.ownerContactName,
          ownerEmail: data?.value?.ownerEmail,
          ownerCellPhone: data?.value?.ownerCellPhone,
          ownerOfficePhone: data?.value?.ownerOfficePhone,
          ownerContactFaxNumber: data?.value?.ownerContactFaxNumber,
          ownerId: data?.value?.ownerId,
          ownerAddress1: data?.value?.ownerAddress1,
          ownerAddress2: data?.value?.ownerAddress2,
          ownerPostalCode: data?.value?.ownerPostalCode,
          ownerCity: data?.value?.ownerCity,
        });
      },
      error: (error) => {
        console.log(error);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
    });
  }
  //add a new
  submit() {
    if (this.editForm.valid) {
      let data = {
        ...this.editForm.value,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService?.update('customers', this.customerId, data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            // this.router.navigate(['/modules/customers/allCustomers']);
          }
        },
        error: (err: any) => {
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
          this.uploading = false;
        },
        complete: () => {
          this.uploading = false;
        },
      });
    } else {
      if (this.currentLanguage == 'ar') {
        this.toastr.warning('الرجاء إدخال الحقول المطلوبة');
      } else {
        this.toastr.warning('Please enter the required fields');
      }
    }
  }
}
