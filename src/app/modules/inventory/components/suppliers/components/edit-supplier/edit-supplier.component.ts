import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.css'],
})
export class EditSupplierComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  uploading: boolean = false;
  file: any = null;
  currentFile: string = 'Add Image';
  updateId: any = null;

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
      supplierName: ['', [Validators.required]],
      website: [''],
      emailId: [''],
      contactNumber: [''],
      contactName: [''],
      address: [''],
      status: ['false'],
    });
  }
  ngAfterViewInit(): void {
    this.getCurrentData();
  }

  ngOnInit() {
    this.getTheme();
    this.getCurrentActiveUser();
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
    let user = localStorage.getItem('firelab-loginData');
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
      // var reader = new FileReader();
      // reader.readAsDataURL(event.target.files[0]);
      // reader.onload = () => {
      //   this.fileURL = reader.result;
      //   this.uploadLoading = false;
      // };
    }
  }
  clearImage() {
    this.file = null;
  }

  truncateString(str: any, length: any, ending = '...') {
    if (str?.length > length) {
      return str.slice(0, length - ending?.length) + ending;
    }
    return str;
  }

  // get current data
  getCurrentData() {
    this.apiService.getById('suppliers', this.updateId).subscribe({
      next: (data: any) => {
        //  set values
        console.log(data);
        if (data?.isSuccess) {
          this.currentFile = data?.value?.logo;
          this.addForm.patchValue({
            supplierName: data?.value?.supplierName,
            website: data?.value?.website,
            emailId: data?.value?.emailId,
            contactNumber: data?.value?.contactNumber,
            contactName: data?.value?.contactName,
            address: data?.value?.address,
            status: data?.value?.status ? 'true' : 'false',
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
      let newStatus: any = data?.status == 'true' ? true : false;

      let formData = new FormData();

      if (this.file != null) {
        formData.append('file', this.file);
      }
      formData.append('supplierName', this.addForm.get('supplierName')?.value);
      formData.append('website', this.addForm.get('website')?.value);
      formData.append('emailId', this.addForm.get('emailId')?.value);
      formData.append(
        'contactNumber',
        this.addForm.get('contactNumber')?.value
      );
      formData.append('contactName', this.addForm.get('contactName')?.value);
      formData.append('address', this.addForm.get('address')?.value);
      formData.append('status', newStatus);

      console.log(data);
      this.uploading = true;
      // api
      this.apiService
        .updateFormData('suppliers', this.updateId, formData)
        .subscribe({
          next: (data) => {
            console.log(data);
            if (data?.isSuccess) {
              if (this.currentLanguage == 'ar') {
                this.toastr.success('تمت إضافة البيانات بنجاح...');
              } else {
                this.toastr.success('data added successfully...', 'Success');
              }
              this.router.navigate(['/modules/inventory/suppliers']);
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
