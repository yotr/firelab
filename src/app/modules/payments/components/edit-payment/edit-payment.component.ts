import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.css'],
})
export class EditPaymentComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  uploading: boolean = false;

  // invoices
  invoices: any[] = [];
  invoicesCurrentPage: number = 1;
  invoicesLoading: boolean = true;

  selectedCustomer: any = null;
  statusDropdown: any[] = [];
  currentPaymentStatus: any = null;
  selectedInvoice: any = null;

  updateId: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private auth: AuthService
  ) {
    //get id
    this.activatedRoute.paramMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('id')) {
        this.updateId = paramMap['get']('id');
      }
    });
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
    this.getCurrentData();
  }

  ngOnInit() {
    this.getTheme();
    this.getCurrentLanguage();
    this.getCurrentActiveUser();
    this.getInvoices();
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

  // get current data
  getCurrentData() {
    this.apiService.getById('payments', this.updateId).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          //  set values
          this.addForm.patchValue({
            invoicesId: data?.value?.invoicesId,
            customerId: data?.value?.customerId,
            paidAmount: data?.value?.paidAmount,
            totalAmount: data?.value?.totalAmount,
            bankName: data?.value?.bankName,
            paymentType: data?.value?.paymentType,
            address: data?.value?.address,
            country: data?.value?.country,
            iban: data?.value?.iban,
            swiftCode: data?.value?.swiftCode,
            status: data?.value?.status,
          });
          this.currentPaymentStatus = this.statusDropdown[data?.value?.status];
          this.selectedInvoice = data?.value?.invoice?.invoiceNumber;
          this.selectedCustomer = data?.value?.invoice?.customer?.businessName;
        }
      },
      error: (error) => {
        console.log(error);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {},
    });
  }

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
      this.apiService.update('payments', this.updateId, data).subscribe({
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
          }
          this.uploading = false;
        },
        error: (err: any) => {
          this.uploading = false;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
            this.toastr.error(err?.message, 'Error');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
            this.toastr.error(err?.message, 'Error');
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
