import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-parts',
  templateUrl: './edit-parts.component.html',
  styleUrls: ['./edit-parts.component.css'],
})
export class EditPartsComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  // categories
  categories: any[] = [];
  categoriesLoading: boolean = true;
  getDataError: boolean = false;
  // suppliers
  suppliers: any[] = [];
  suppliersLoading: boolean = true;
  totalItemsCount: number = 0;
  // defaultPermissions: Permission[];
  uploading: boolean = false;
  file: any = null;
  currentFile: string = 'Add Image';
  updateId: any = null;
  currentSupplier: any = null;
  defaultImgUrl: any = 'assets/img/camera.png';
  currentPage: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    // private permissionsService: PermissionsService,
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
      supplierId: [null, [Validators.required]],
      reportCategoryId: [null, [Validators.required]],
      partName: ['', [Validators.required]],
      sku: [''],
      make: ['', [Validators.required]],
      model: ['', [Validators.required]],
      cost: [0, [Validators.required]],
      quantity: [0, [Validators.required]],
      status: ['InStock'],
    });
  }
  ngAfterViewInit(): void {
    this.getCurrentData();
  }
  ngOnInit() {
    this.getTheme();
    this.getCurrentActiveUser();
    this.getSuppliers();
    this.getCategories();
  }
  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
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
  //get selected files form device
  getSelectedFiles(event: any) {
    if (event?.target?.files) {
      this.file = event?.target?.files[0];
      // this.onSelectFiles.emit(event?.target?.files);
      // get files as url
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.defaultImgUrl = reader.result;
        // this.uploadLoading = false;
      };
    }
  }
  clearImage() {
    this.file = null;
  }

  truncateString(str: any, length: any, ending = '...') {
    if (str.length > length) {
      return str.slice(0, length - ending.length) + ending;
    }
    return str;
  }

  onSelectSuppliers(supplier: any) {
    this.addForm.patchValue({
      supplierId: supplier?.id,
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

  // get Suppliers data
  getSuppliers(page?: number, pageSize?: number) {
    this.apiService
      .filterData(
        'suppliers/getFilteredSuppliers',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.suppliers = data?.value?.suppliers;
            this.totalItemsCount = data?.value?.totalCount;
            // this.getDataError = false;
          }
          this.suppliersLoading = false;
        },
        error: (err) => {
          this.suppliers = [];
          this.suppliersLoading = false;
          this.getDataError = true;
          console.log(err);
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
          this.suppliersLoading = false;
        },
        complete: () => {
          this.suppliersLoading = false;
        },
      });
  }
  // get data
  getDataEnd(page?: number, pageSize?: number) {
    this.suppliersLoading = true;
    // api
    this.apiService
      .filterData(
        'suppliers/getFilteredSuppliers',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.suppliers = [...this.suppliers, ...data?.value?.suppliers];
            //  this.totalItemsCount = data?.value?.totalCount;
            this.getDataError = false;
          }
          this.suppliersLoading = false;
        },
        error: (err: any) => {
          this.suppliersLoading = false;
          this.getDataError = true;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
        complete: () => {
          this.suppliersLoading = false;
        },
      });
  }
  loadMore() {
    this.currentPage++;
    this.getDataEnd(this.currentPage);
  }
  onFilterSuppliers(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('suppliers/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.suppliers = data?.value;
              this.totalItemsCount = data?.value?.length;
            }
            this.suppliersLoading = false;
          },
          error: (err: any) => {
            this.suppliersLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getSuppliers();
    }
  }

  // get current data
  getCurrentData() {
    this.apiService.getById('parts', this.updateId).subscribe({
      next: (data: any) => {
        //  set values
        console.log(data);
        if (data?.isSuccess) {
          this.currentFile = data?.value?.image;
          this.defaultImgUrl =
            environment.API + '/images/' + data?.value?.image;
          this.currentSupplier = data?.value?.supplier?.supplierName;
          this.addForm.patchValue({
            supplierId: data?.value?.supplierId,
            reportCategoryId: data?.value?.reportCategoryId,
            partName: data?.value?.partName,
            sku: data?.value?.sku,
            make: data?.value?.make,
            model: data?.value?.model,
            cost: data?.value?.cost,
            quantity: data?.value?.quantity,
            status: data?.value?.status,
          });
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
  //add a new
  submit() {
    if (this.addForm.valid) {
      let data = {
        ...this.addForm.value,
      };
      let formData = new FormData();
      if (this.file != null) {
        formData.append('file', this.file);
      }
      formData.append('supplierId', this.addForm.get('supplierId')?.value);
      formData.append(
        'reportCategoryId',
        this.addForm.get('reportCategoryId')?.value
      );
      formData.append('partName', this.addForm.get('partName')?.value);
      formData.append('sku', this.addForm.get('sku')?.value);
      formData.append('make', this.addForm.get('make')?.value);
      formData.append('model', this.addForm.get('model')?.value);
      formData.append('cost', this.addForm.get('cost')?.value);
      formData.append('quantity', this.addForm.get('quantity')?.value);
      formData.append('status', this.addForm.get('status')?.value);

      console.log(data);
      this.uploading = true;
      // api
      this.apiService
        .updateFormData('parts', this.updateId, formData)
        .subscribe({
          next: (data) => {
            console.log(data);
            if (data?.isSuccess) {
              if (this.currentLanguage == 'ar') {
                this.toastr.success('تمت إضافة البيانات بنجاح...');
              } else {
                this.toastr.success('data added successfully...', 'Success');
              }
              this.router.navigate(['/modules/inventory/parts']);
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
  trackFun(index: number, item: any): number {
    return item.id;
  }
}
