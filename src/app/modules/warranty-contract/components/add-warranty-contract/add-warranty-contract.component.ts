import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-add-warranty-contract',
  templateUrl: './add-warranty-contract.component.html',
  styleUrls: ['./add-warranty-contract.component.css'],
})
export class AddWarrantyContractComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  uploading: boolean = false;

  // customer
  customers: any[] = [];
  customersLoading: boolean = true;

  // warranty
  warranty: any[] = [];
  warrantyLoading: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService,
    private auth: AuthService
  ) {
    // Add form
    this.addForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      status: [false, [Validators.required]],
      warrantyId: [null, [Validators.required]],
      customerId: [null, [Validators.required]],
    });
  }
  ngAfterViewInit(): void {
    this.getWarranty();
    this.getCustomers();
  }
  ngOnInit() {
    this.getTheme();
    this.getCurrentLanguage();
    this.getCurrentActiveUser();
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

  // get current user
  getCurrentActiveUser() {
    // check local storage
    let user = localStorage.getItem('mms-loginData');
    // if exist
    if (user) {
      this.auth.currentUserSignal.set(JSON.parse(user));
      this.currentUser = JSON.parse(user)?.userData;
    } else {
    }
  }

  // on select warranty
  onSelectWarranty(data: any) {
    this.addForm.patchValue({
      warrantyId: data?.id,
    });
  }
  // get members data
  getWarranty(page?: number, pageSize?: number) {
    // api
    this.apiService
      .filterData(
        'warranty/getFilteredWarranties',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.warranty = data?.value?.warranty;
          }
          this.warrantyLoading = false;
        },
        error: (err: any) => {
          this.warrantyLoading = false;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
        complete: () => {},
      });
  }
  onFilterWarranty(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('warranty/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.warranty = data?.value;
            }
            this.warrantyLoading = false;
          },
          error: (err: any) => {
            this.warrantyLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getWarranty();
    }
  }
  // on select cusotmer
  onSelectCustomer(data: any) {
    this.addForm.patchValue({
      customerId: data?.id,
    });
  }
  // get Customers data
  getCustomers(page?: number, pageSize?: number) {
    // api
    this.apiService
      .filterData(
        'customers/getFilteredCustomers',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.customers = data?.value?.customerDto;
          }
          this.customersLoading = false;
        },
        error: (err: any) => {
          this.customersLoading = false;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
        complete: () => {},
      });
  }
  onFilterCustomers(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('customers/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.customers = data?.value;
            }
            this.customersLoading = false;
          },
          error: (err: any) => {
            this.customersLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getCustomers();
    }
  }

  //add a new
  submit() {
    if (this.addForm.valid) {
      let data = {
        ...this.addForm.value,
        status: this.addForm.get('status')?.value == 'true' ? true : false,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService.add('warrantyContract/add', data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            this.router.navigate(['/modules/warranty-contract']);
          } else {
            this.uploading = false;
            if (this.currentLanguage == 'ar') {
              this.toastr.error('هناك شيء خاطئ', 'خطأ');
            } else {
              this.toastr.error('There Is Somthing Wrong', 'Error');
            }
          }
        },
        error: (err: any) => {
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
            this.toastr.error(err?.error[0]?.message, 'Error');
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
