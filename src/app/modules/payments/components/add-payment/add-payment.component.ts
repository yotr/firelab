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
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css'],
})
export class AddPaymentComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  uploading: boolean = false;

  // customer
  // customers: any[] = [];
  // customersCurrentPage: number = 1;
  // customersLoading: boolean = true;

  // invoices
  invoices: any[] = [];
  invoicesCurrentPage: number = 1;
  invoicesLoading: boolean = true;

  selectedCustomer: any = null;
  statusDropdown: any[] = [];
  currentPaymentStatus: any = null;

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
      invoicesId: [null, [Validators.required]],
      customerId: [null, [Validators.required]],
      paidAmount: [0, [Validators.required]],
      totalAmount: [0, [Validators.required]],
      bankName: [''],
      paymentType: [''],
      address: [''],
      country: [''],
      iban: [''],
      swiftCode: [''],
      status: [0, [Validators.required]],
    });

    this.statusDropdown = [
      {
        id: 0,
        title: this.translateService.instant('payments.table.unpaid'),
        value: 'payments.table.unpaid',
        color: 'text-danger',
      },
      {
        id: 1,
        title: this.translateService.instant('payments.table.partialyPaid'),
        value: 'payments.table.partialyPaid',
        color: 'text-warning',
      },
      {
        id: 2,
        title: this.translateService.instant('payments.table.paid'),
        value: 'payments.table.paid',
        color: 'text-success',
      },
    ];

    this.currentPaymentStatus = this.statusDropdown[0];
  }
  ngAfterViewInit(): void {
    this.getInvoices();
    // this.getCustomers();
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

  onPaidAmountChange() {
    if (this.addForm.get('paidAmount')?.value != 0) {
      if (
        this.addForm.get('paidAmount')?.value <
        this.addForm.get('totalAmount')?.value
      ) {
        this.currentPaymentStatus = this.statusDropdown[1];
      } else if (
        this.addForm.get('paidAmount')?.value ==
        this.addForm.get('totalAmount')?.value
      ) {
        this.currentPaymentStatus = this.statusDropdown[2];
      }
    } else {
      this.currentPaymentStatus = this.statusDropdown[0];
    }
  }

  onSelectInvoice(data: any) {
    console.log(data);
    this.selectedCustomer = data?.customer?.businessName;
    this.addForm.patchValue({
      invoicesId: data?.id,
      customerId: data?.customer?.id,
      totalAmount: data?.grandTotal,
    });
  }
  getInvoices(page?: number, pageSize?: number) {
    this.invoicesCurrentPage = 1;
    this.invoicesLoading = true;
    // api
    this.apiService
      .filterData(
        'invoices/getFilteredInvoices',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.invoices = data?.value?.invoices;
          }
          this.invoicesLoading = false;
        },
        error: (err: any) => {
          this.invoicesLoading = false;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
        complete: () => {
          this.invoicesLoading = false;
        },
      });
  }
  // get data
  getInvoicesEnd(page?: number, pageSize?: number) {
    this.invoicesLoading = true;
    // api
    this.apiService
      .filterData(
        'invoices/getFilteredInvoices',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.invoices = [...this.invoices, ...data?.value?.invoices];
          }
          this.invoicesLoading = false;
        },
        error: (err: any) => {
          this.invoicesLoading = false;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
        complete: () => {
          this.invoicesLoading = false;
        },
      });
  }
  loadMore() {
    this.invoicesCurrentPage++;
    this.getInvoicesEnd(this.invoicesCurrentPage);
  }
  onFilterInvoice(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('invoices/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.invoices = data?.value;
            }
            this.invoicesLoading = false;
          },
          error: (err: any) => {
            this.invoicesLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getInvoices();
    }
  }

  // onSelectCustomer(data: any) {
  //   this.addForm.patchValue({
  //     customerId: data?.id,
  //   });
  // }
  // getCustomers(page?: number, pageSize?: number) {
  //   this.customersCurrentPage = 1;
  //   this.customersLoading = true;
  //   // api
  //   this.apiService
  //     .filterData(
  //       'customers/getFilteredCustomers',
  //       page ? page : 1,
  //       pageSize ? pageSize : 10
  //     )
  //     .subscribe({
  //       next: (data: any) => {
  //         console.log(data);
  //         if (data?.isSuccess) {
  //           this.customers = data?.value?.customerDto;
  //         }
  //         this.customersLoading = false;
  //       },
  //       error: (err: any) => {
  //         this.customersLoading = false;
  //         if (this.currentLanguage == 'ar') {
  //           this.toastr.error('هناك شيء خاطئ', 'خطأ');
  //         } else {
  //           this.toastr.error('There Is Somthing Wrong', 'Error');
  //         }
  //       },
  //       complete: () => {
  //         this.customersLoading = false;
  //       },
  //     });
  // }
  // // get data
  // getCustomersEnd(page?: number, pageSize?: number) {
  //   this.customersLoading = true;
  //   // api
  //   this.apiService
  //     .filterData(
  //       'customers/getFilteredCustomers',
  //       page ? page : 1,
  //       pageSize ? pageSize : 10
  //     )
  //     .subscribe({
  //       next: (data: any) => {
  //         console.log(data);
  //         if (data?.isSuccess) {
  //           this.customers = [...this.customers, ...data?.value?.customerDto];
  //         }
  //         this.customersLoading = false;
  //       },
  //       error: (err: any) => {
  //         this.customersLoading = false;
  //         if (this.currentLanguage == 'ar') {
  //           this.toastr.error('هناك شيء خاطئ', 'خطأ');
  //         } else {
  //           this.toastr.error('There Is Somthing Wrong', 'Error');
  //         }
  //       },
  //       complete: () => {
  //         this.customersLoading = false;
  //       },
  //     });
  // }
  // loadMoreCustomers() {
  //   this.customersCurrentPage++;
  //   this.getCustomersEnd(this.customersCurrentPage);
  // }
  // onFilterCustomers(value: string) {
  //   if (value != null && value?.trim() != '') {
  //     this.apiService
  //       .globalSearch('customers/globalsearch', value, null)
  //       .subscribe({
  //         next: (data: any) => {
  //           console.log(data);
  //           if (data?.isSuccess) {
  //             this.customers = data?.value;
  //           }
  //           this.customersLoading = false;
  //         },
  //         error: (err: any) => {
  //           this.customersLoading = false;
  //           this.toastr.error('There Is Somthing Wrong', 'Error');
  //         },
  //       });
  //   } else {
  //     this.getCustomers();
  //   }
  // }

  //add a new
  submit() {
    if (this.addForm.valid) {
      let newStatus = 0;

      if (this.addForm.get('paidAmount')?.value != 0) {
        if (
          this.addForm.get('paidAmount')?.value <
          this.addForm.get('totalAmount')?.value
        ) {
          newStatus = 1;
        } else if (
          this.addForm.get('paidAmount')?.value ==
          this.addForm.get('totalAmount')?.value
        ) {
          newStatus = 2;
        }
      } else {
        newStatus = 0;
      }
      let data = {
        ...this.addForm.value,
        status: newStatus,
      };
      console.log(data);
      // api
      this.uploading = true;
      this.apiService.add('payments/add', data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            this.router.navigate(['/modules/payments']);
          } else {
            if (this.currentLanguage == 'ar') {
              this.toastr.error('هناك شيء خاطئ', 'خطأ');
            } else {
              this.toastr.error('There Is Somthing Wrong', 'Error');
            }
            this.uploading = false;
          }
        },
        error: (err: any) => {
          this.uploading = false;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
            this.toastr.error(err, 'Error');
          }
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
