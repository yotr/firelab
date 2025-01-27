import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css'],
})
export class EditJobComponent implements OnInit, AfterViewInit {
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
  // warrantyContracts
  warrantyContracts: any[] = [];
  warrantyContractsLoading: boolean = true;

  currentJob: any = null;
  currentWarrantyContract: any = null;

  updateId: any = null;
  uploading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private sidebarService: SidebarService,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
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
      customerId: [null],
      description: ['', [Validators.required]],
      reportCategoryId: [null, [Validators.required]],
      dateTime: ['', [Validators.required]],
      type: [''],
      jobId: [''],
      action: ['notAssigned'],
      warrantyStatus: ['false'],
      warrantyContractId: [null],
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
        this.addDeficency(data?.id, data);
      }
    }
  }
  //removing rows from table
  removeItem(i: any, id: any): void {
    this.deleteDeficency(id, i);
  }
  addRow() {
    $('#add_deficiency_modal').modal('show');
  }
  ngAfterViewInit(): void {
    this.getCategories();
    this.getWarrantyContacts();
  }

  ngOnInit() {
    this.getTheme();
    this.getCurrentData();
  }
  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
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

  // on select warranty
  onSelectWarrantyContract(data: any) {
    this.addForm.patchValue({
      warrantyContractId: data?.id,
    });
  }
  // get data
  getWarrantyContacts(page?: number, pageSize?: number) {
    // api
    this.apiService
      .filterData(
        'warrantyContract/getFilteredWarrantyContracts',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.warrantyContracts = data?.value?.warrantyContracts;
          }
          this.warrantyContractsLoading = false;
        },
        error: (err: any) => {
          this.warrantyContractsLoading = false;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
        complete: () => {},
      });
  }
  onFilterWarrantyContract(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('warrantyContract/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.warrantyContracts = data?.value;
            }
            this.warrantyContractsLoading = false;
          },
          error: (err: any) => {
            this.warrantyContractsLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getWarrantyContacts();
    }
  }
  formatDate(date: string): any {
    var newDate: Date = new Date(date); // Parse the input date string

    const year = newDate.getFullYear(); // Get the year
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month (1-based) and ensure 2 digits
    const day = newDate.getDate().toString().padStart(2, '0'); // Get the day and ensure 2 digits
    return `${year}-${month}-${day}`; // Return formatted date string
  }

  // get items comeing from data
  addExistingItems(items: any[]): void {
    items?.map((item: any) => {
      // push item in items list data
      let value = this.formBuilder.group({
        id: item?.id,
        name: item?.deficiency?.name,
      });
      this.deficiencyIds.push(value);
    });
  }

  // get current data
  getCurrentData() {
    this.apiService.getById('jobs', this.updateId).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          //  set values
          this.addForm.patchValue({
            description: data?.value?.description,
            reportCategoryId: data?.value?.reportCategoryId,
            type: data?.value?.type,
            dateTime: this.formatDate(data?.value?.dateTime),
            jobId: data?.value?.jobId,
            action: data?.value?.action,
            name: data?.value?.name,
            customerId: data?.value?.customerId,
            status: data?.value?.status,
            warrantyStatus: data?.value?.warrantyStatus,
            warrantyContractId: data?.value?.warrantyContractId,
            warrantyStartDate: this.formatDate(data?.value?.warrantyStartDate),
          });

          this.currentJob = data?.value;
          this.addExistingItems(data?.value?.assignedDeficiencies);

          if (data?.value?.warrantyContractId != null) {
            this.getWarrantyContract(data?.value?.warrantyContractId);
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

  submit() {
    const isFormChanged = this.addForm.dirty;

    if (isFormChanged) {
      if (this.addForm.valid) {
        let data = {
          ...this.addForm.value,
          warrantyStatus:
            this.formValues['warrantyStatus'].value == 'true' ? true : false,
          deficiencyIds: null,
        };
        console.log(data);
        this.uploading = true;
        // api
        this.apiService.update('jobs', this.updateId, data).subscribe({
          next: (data) => {
            console.log(data);
            if (data?.isSuccess) {
              if (this.currentLanguage == 'ar') {
                this.toastr.success('تمت إضافة البيانات بنجاح...');
              } else {
                this.toastr.success('data added successfully...', 'Success');
              }
              window.history.back();
              // this.router.navigate(['/modules/customers/addJob'], {
              //   queryParams: { customerId: this.customerId },
              // });
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
    } else {
      console.log('No changes in the form');
      history.back();
    }
  }

  //add deficency
  addDeficency(deficiencyId: any, value: any): void {
    let newData = {
      deficiencyId: deficiencyId,
      jobId: this.updateId,
    };
    // api
    this.apiService.add('jobs/assignedDeficiencies/add', newData).subscribe({
      next: (data) => {
        console.log(data);
        if (data?.isSuccess) {
          this.deficiencyIds.push(this.newItem(value));
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

  //add deficency
  deleteDeficency(deficiencyId: any, i: number): void {
    // api
    this.apiService
      .delete('jobs/assignedDeficiencies/delete', deficiencyId)
      .subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            this.deficiencyIds.removeAt(i);
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

  // get current data
  getWarrantyContract(id: any) {
    this.apiService.getById('warrantyContract', id).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.currentWarrantyContract = data?.value;
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
}
