import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css'],
})
export class AddJobComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  // types
  types: any[] = [];
  typesLoading: boolean = true;
  // categories
  categories: any[] = [];
  categoriesLoading: boolean = true;
  getDataError: boolean = false;
  // warranties
  warranties: any[] = [];
  warrantiesLoading: boolean = true;
  warrantiesGetDataError: boolean = false;

  customerId: any = null;
  uploading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
    private themeService: ThemeService,
    private toastr: ToastrService,
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

    // Add form
    this.addForm = this.formBuilder.group({
      description: ['', [Validators.required]],
      reportCategoryId: [null, [Validators.required]],
      dateTime: ['', [Validators.required]],
      type: [''],
      jobId: [''],
      action: ['notAssigned'],
      name: [''],
      warrantyStatus: ['false'],
      warrantyId: [null],
      warrantyStartDate: [null],
      deficiencyIds: this.formBuilder.array([]),
    });

    // this.types = [
    //   {
    //     id: 0,
    //     name: 'Bell',
    //   },
    //   {
    //     id: 1,
    //     name: 'Door Holder',
    //   },
    //   {
    //     id: 2,
    //     name: 'Door Lock',
    //   },
    // ];
  }

  get formValues() {
    return this.addForm.controls;
  }

  get deficiencyIds(): FormArray {
    return this.addForm.get('deficiencyIds') as FormArray;
  }
  newItem(data: any): FormGroup {
    return this.formBuilder.group({
      id: data.id,
      name: data.name,
    });
  }
  addItem(data: any) {
    $('#add_deficiency_modal').modal('hide');
    if (data != null && data?.id && data?.name) {
      let isExist = this.deficiencyIds.value?.find(
        (d: any) => d.id == data?.id
      );

      if (isExist != undefined) {
        if (this.currentLanguage == 'ar') {
          this.toastr.warning('هذا العنصر موجود بالفعل');
        } else {
          this.toastr.warning('this item already exist');
        }
      } else {
        this.deficiencyIds.push(this.newItem(data));
      }
    }
  }
  //removing rows from table
  removeItem(i: any) {
    this.deficiencyIds.removeAt(i);
  }
  addRow() {
    $('#add_deficiency_modal').modal('show');
  }
  ngAfterViewInit(): void {
    this.getCategories();
    this.getWarranties();
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
  // get categories data
  getCategories() {
    this.apiService.get('reportCategories').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.categories = data?.value;
          this.getDataError = false;
        }
        this.categoriesLoading = false;
      },
      error: (err) => {
        this.categories = [];
        this.categoriesLoading = false;
        this.getDataError = true;
        console.log(err);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
        this.categoriesLoading = false;
      },
      complete: () => {
        this.categoriesLoading = false;
      },
    });
  }
  // get warranties data
  getWarranties() {
    this.apiService.get('warranty').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.warranties = data?.value;
          this.warrantiesGetDataError = false;
        }
        this.warrantiesLoading = false;
      },
      error: (err) => {
        this.warranties = [];
        this.warrantiesLoading = false;
        this.warrantiesGetDataError = true;
        console.log(err);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
        this.warrantiesLoading = false;
      },
      complete: () => {
        this.warrantiesLoading = false;
      },
    });
  }
  submit() {
    if (this.addForm.valid) {
      var newDeficiencyIds = this.deficiencyIds.value?.map((d: any) => d.id);
      let data = {
        ...this.addForm.value,
        customerId: this.customerId,
        name: this.addForm.get('description')?.value,
        status: false,
        warrantyStatus:
          this.formValues['warrantyStatus'].value == 'true' ? true : false,
        deficiencyIds: newDeficiencyIds,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService?.add('jobs/add', data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            // this.router.navigate(['/modules/customers/addJob'], {
            //   queryParams: { customerId: this.customerId },
            // });

            this.addForm.reset();
            this.addForm.patchValue({
              action: 'notAssigned',
            });
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
    } else {
      if (this.currentLanguage == 'ar') {
        this.toastr.warning('الرجاء إدخال الحقول المطلوبة');
      } else {
        this.toastr.warning('Please enter the required fields');
      }
    }
  }
}
