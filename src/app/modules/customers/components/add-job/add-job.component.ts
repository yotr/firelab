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
  // warrantyContracts
  warrantyContracts: any[] = [];
  warrantyContractsLoading: boolean = true;
  currentWarrantyContracts: any = null;

  customerId: any = null;
  uploading: boolean = false;
  isJobIdDisabled: boolean = false;

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
      name: ['', [Validators.required]],
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
      items: this.formBuilder.array([]),
      autoJobId: [false],
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
  get items(): FormArray {
    return this.addForm.get('items') as FormArray;
  }

  onJobIdAutoChange() {
    let isAuto = this.formValues['autoJobId'].value;
    if (isAuto) {
      this.isJobIdDisabled = true;
      this.addForm.patchValue({
        jobId: '',
      });
    } else {
      this.isJobIdDisabled = false;
    }
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

  newWarrantyContractItem(data: any, id: any): FormGroup {
    return this.formBuilder.group({
      id: id,
      name: data.name,
      cost: data.cost,
      quantity: data.quantity,
      qty: data.qty,
      itemId: data.itemId,
    });
  }
  addWarrantyContractItem(data: any) {
    $('#add_items_modal').modal('hide');
    if (data != null && data?.itemId && data?.name) {
      let isExist = this.items.value?.find((d: any) => d.name == data?.name);

      if (isExist != undefined) {
        if (this.currentLanguage == 'ar') {
          this.toastr.warning('هذا العنصر موجود بالفعل');
        } else {
          this.toastr.warning('this item already exist');
        }
      } else {
        this.assignItem(data?.itemId, this.currentWarrantyContracts?.id, data);
      }
    }
  }
  //removing rows from table
  removeWarrantyContractItem(i: any, data: any): void {
    this.deleteItem(data, i);
  }
  addWarrantyContractRow() {
    $('#add_items_modal').modal('show');
  }
  // get items comeing from data
  addExistingWarrantyContractItems(items: any[]): void {
    items?.map((item: any) => {
      // push item in items list data
      let value = this.formBuilder.group({
        id: item?.id,
        name: item?.item?.name,
        cost: item?.item?.cost,
        quantity: item?.item?.quantity,
        qty: item?.quantity,
        itemId: item?.item?.id,
      });
      this.items.push(value);
    });
  }

  ngAfterViewInit(): void {
    this.getCategories();
    this.getWarrantyContacts();
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

  // on select warranty
  onSelectWarrantyContract(data: any) {
    this.items.clear();
    this.currentWarrantyContracts = data;
    // console.log(data);
    this.addExistingWarrantyContractItems(data?.items);
    this.addForm.patchValue({
      warrantyContractId: data?.id,
    });
  }
  // get data
  getWarrantyContacts(page?: number, pageSize?: number) {
    // api
    this.apiService
      .filterData(
        `warrantyContract/getFilteredWarrantyContractsOfCustomer/${this.customerId}`,
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
        .globalSearch(
          `warrantyContract/globalSearchOfCustomer/${this.customerId}`,
          value,
          null
        )
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
  submit() {
    if (this.addForm.valid) {
      var newDeficiencyIds = this.deficiencyIds.value?.map((d: any) => d.id);
      let data = {
        ...this.addForm.value,
        customerId: this.customerId,
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

            this.addForm.reset();
            this.addForm.patchValue({
              action: 'notAssigned',
            });

            this.router.navigate(['/modules/jobLink'], {
              queryParams: { view: 'Week' },
            });
          }
        },
        error: (err: any) => {
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
            this.toastr.error(err);
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

  //add item
  assignItem(id: any, warrantyContractId: any, value: any): void {
    let newData = {
      warrantyContractId: warrantyContractId,
      ItemsId: id,
      quantity: value?.qty,
    };
    // api
    this.apiService.add('assignedItems/add', newData).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.items.push(this.newWarrantyContractItem(value, data?.value?.id));
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تمت إضافة البيانات بنجاح...');
          } else {
            this.toastr.success('data added successfully...', 'Success');
          }
          let newQty = value?.quantity - value?.qty;
          this.updateItemQuantity(id, newQty);
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
  deleteItem(item: any, i: number): void {
    // api
    this.apiService.delete('assignedItems', item?.id).subscribe({
      next: (data) => {
        console.log(data);
        if (data?.isSuccess) {
          this.items.removeAt(i);
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تمت حذف البيانات بنجاح...');
          } else {
            this.toastr.success('data deleted successfully...', 'Success');
          }
          let qty = item?.quantity + item?.qty;
          this.updateItemQuantity(item?.itemId, qty);
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

  updateItemQuantity(id: any, qty: number) {
    let newQty = {
      qty: qty,
    };
    // update
    this.apiService.update(`items/updateQty`, id, newQty).subscribe({
      next: (data) => {
        if (data?.isSuccess) {
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تم تحديث العنصر بنجاح...');
          } else {
            this.toastr.success('item updated successfully...');
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
      },
      complete: () => {},
    });
  }
  onWarrantyStatusChange(event: any): void {
    if (event.target.value == 'false') {
      this.addForm.patchValue({
        warrantyContractId: null,
      });
    }
  }
}
