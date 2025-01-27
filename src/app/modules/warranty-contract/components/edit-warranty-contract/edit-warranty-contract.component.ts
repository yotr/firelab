import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;

@Component({
  selector: 'app-edit-warranty-contract',
  templateUrl: './edit-warranty-contract.component.html',
  styleUrls: ['./edit-warranty-contract.component.css'],
})
export class EditWarrantyContractComponent implements OnInit {
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

  updateId: any = null;

  cusrrentCustomer: any = null;
  cusrrentWarranty: any = null;

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
      name: ['', [Validators.required]],
      status: [false, [Validators.required]],
      warrantyId: [null, [Validators.required]],
      customerId: [null, [Validators.required]],
      items: this.formBuilder.array([]),
    });
  }
  get formValues() {
    return this.addForm.controls;
  }
  get items(): FormArray {
    return this.addForm.get('items') as FormArray;
  }
  newItem(data: any, id: any): FormGroup {
    return this.formBuilder.group({
      id: id,
      name: data.name,
    });
  }
  addItem(data: any) {
    $('#add_items_modal').modal('hide');
    if (data != null && data?.id && data?.name) {
      let isExist = this.items.value?.find((d: any) => d.id == data?.id);

      if (isExist != undefined) {
        if (this.currentLanguage == 'ar') {
          this.toastr.warning('هذا العنصر موجود بالفعل');
        } else {
          this.toastr.warning('this item already exist');
        }
      } else {
        this.assignItem(data?.id, data);
      }
    }
  }
  //removing rows from table
  removeItem(i: any, id: any): void {
    this.deleteItem(id, i);
  }
  addRow() {
    $('#add_items_modal').modal('show');
  }
  // get items comeing from data
  addExistingItems(items: any[]): void {
    items?.map((item: any) => {
      // push item in items list data
      let value = this.formBuilder.group({
        id: item?.id,
        name: item?.item?.name,
      });
      this.items.push(value);
    });
  }
  ngAfterViewInit(): void {
    this.getCurrentData();
  }
  ngOnInit() {
    this.getTheme();
    this.getCurrentLanguage();
    this.getCurrentActiveUser();
    this.getWarranty();
    this.getCustomers();
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
    let user = localStorage.getItem('firelab-loginData');
    // if exist
    if (user) {
      this.auth.currentUserSignal.set(JSON.parse(user));
      this.currentUser = JSON.parse(user)?.userData;
    } else {
    }
  }

  // get current data
  getCurrentData() {
    this.apiService.getById('warrantyContract', this.updateId).subscribe({
      next: (data: any) => {
        //  set values
        if (data.isSuccess) {
          console.log(data);
          this.addForm.patchValue({
            name: data?.value?.name,
            status: data?.value?.status,
            warrantyId: data?.value?.warrantyId,
            customerId: data?.value?.customerId,
          });
          this.cusrrentCustomer = data?.value?.customer;
          this.cusrrentWarranty = data?.value?.warranty;
          this.addExistingItems(data?.value?.items);
        } else {
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
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
    });
  }

  // on select warranty
  onSelectWarranty(data: any) {
    console.log(data);
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
    // const isFormChanged = this.addForm.dirty;
    // if (isFormChanged) {
    if (this.addForm.valid) {
      let data = {
        ...this.addForm.value,
        status:
          this.addForm.get('status')?.value == 'true'
            ? true
            : this.addForm.get('status')?.value == true
            ? true
            : false,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService
        .update('warrantyContract', this.updateId, data)
        .subscribe({
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
    // } else {
    //   history.back();
    // }
  }

  //add item
  assignItem(id: any, value: any): void {
    let newData = {
      warrantyContractId: this.updateId,
      ItemsId: id,
    };
    // api
    this.apiService.add('assignedItems/add', newData).subscribe({
      next: (data) => {
        console.log(data);
        if (data?.isSuccess) {
          this.items.push(this.newItem(value, data?.value));
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تمت إضافة البيانات بنجاح...');
          } else {
            this.toastr.success('data added successfully...', 'Success');
          }
        }
      },
      error: (err: any) => {
        console.log('Error:', err);
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
  }

  //add item
  deleteItem(id: any, i: number): void {
    // api
    this.apiService.delete('assignedItems/delete', id).subscribe({
      next: (data) => {
        console.log(data);
        if (data?.isSuccess) {
          this.items.removeAt(i);
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تمت حذف البيانات بنجاح...');
          } else {
            this.toastr.success('data deleted successfully...', 'Success');
          }
        }
      },
      error: (err: any) => {
        console.log('Error:', err);
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
  }
}
