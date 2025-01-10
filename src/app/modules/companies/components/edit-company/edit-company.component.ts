import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { passwordMatch } from 'src/app/validation/passwordMatch.validation';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css'],
})
export class EditCompanyComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  companies: any[] = [];
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  isCompanySectionActive: boolean = true;
  // categories
  categories: any[] = [];
  categoriesLoading: boolean = true;
  // roles
  roles: any[] = [];
  rolesLoading: boolean = true;

  uploading: boolean = false;

  updateId: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
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
      companyName: ['', [Validators.required]],
      address: [''],
      phone: [''],
      website: [''],
      fax: [''],
      country: [''],
      city: [''],
      state: [''],
      postal: [''],
      contact: [''],
      companyEmail: [''],
      // manager
      managerId: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      // password: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      billableHourlyRate: ['', [Validators.required]],
      position: [''],
      division: [''],
      status: ['clocked'],
      roleId: [null],
    });
  }

  get formValues() {
    return this.addForm.controls;
  }

  ngAfterViewInit(): void {
    this.getCurrentData();
  }

  ngOnInit() {
    this.getRoles();
    this.getTheme();
  }

  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  activeCompanySection() {
    this.isCompanySectionActive = true;
  }
  activeManagerSection() {
    let companyName = this.addForm?.get('companyName')?.value?.trim();
    if (companyName === '') {
      this.toastr.warning('', 'Please enter mandatory field First!');
    } else {
      this.isCompanySectionActive = false;
    }
  }

  onSelectRoles(event: any) {
    console.log(event);
    this.addForm.patchValue({
      roleId: event?.id,
    });
  }

  // get Roles data
  getRoles(page?: number, pageSize?: number) {
    // api
    this.apiService.get('roles').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.roles = data?.value;
          // this.totalItemsCount = data?.value?.totalCount;
          // this.getDataError = false;
        }
        this.rolesLoading = false;
      },
      error: (err: any) => {
        this.rolesLoading = false;
        // this.getDataError = true;
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {},
    });
  }
  // get categories data
  getCategories() {
    this.apiService.get('reportCategories').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.categories = data?.value;
          this.categoriesLoading = false;
        }
      },
      error: (err) => {
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

  // get current data
  getCurrentData() {
    this.apiService.getById('companies', this.updateId).subscribe({
      next: (data: any) => {
        //  set values
        console.log(data);
        if (data?.isSuccess) {
          this.addForm.patchValue({
            companyName: data?.value?.companyName,
            address: data?.value?.address,
            phone: data?.value?.phone,
            website: data?.value?.website,
            fax: data?.value?.fax,
            country: data?.value?.country,
            city: data?.value?.city,
            state: data?.value?.state,
            postal: data?.value?.postal,
            contact: data?.value?.contact,
            companyEmail: data?.value?.email,
            // manager
            managerId: data?.value?.manager?.id,
            firstName: data?.value?.manager?.firstName,
            lastName: data?.value?.manager?.lastName,
            userName: data?.value?.manager?.userName,
            email: data?.value?.manager?.email,
            contactNumber: data?.value?.manager?.contactNumber,
            billableHourlyRate: data?.value?.manager?.billableHourlyRate,
            position: data?.value?.manager?.position,
            division: data?.value?.manager?.division,
            status: data?.value?.manager?.status,
            roleId: data?.value?.manager?.roleId,
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
        companyName: this.addForm.get('companyName')?.value,
        address: this.addForm.get('address')?.value,
        phone: this.addForm.get('phone')?.value,
        website: this.addForm.get('website')?.value,
        fax: this.addForm.get('fax')?.value,
        country: this.addForm.get('country')?.value,
        city: this.addForm.get('city')?.value,
        state: this.addForm.get('state')?.value,
        postal: this.addForm.get('postal')?.value,
        contact: this.addForm.get('contact')?.value,
        email: this.addForm.get('companyEmail')?.value,
        managerId: this.addForm.get('managerId')?.value,
        manager: {
          firstName: this.addForm.get('firstName')?.value,
          lastName: this.addForm.get('lastName')?.value,
          userName: this.addForm.get('userName')?.value,
          email: this.addForm.get('email')?.value,
          // password: this.addForm.get('password')?.value,
          contactNumber: this.addForm.get('contactNumber')?.value,
          billableHourlyRate: this.addForm.get('billableHourlyRate')?.value,
          position: this.addForm.get('position')?.value,
          division: this.addForm.get('division')?.value,
          status: this.addForm.get('status')?.value,
          roleId: this.addForm.get('roleId')?.value,
        },
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService.update('companies', this.updateId, data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            this.router.navigate(['/modules/companies']);
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

  trackFun(index: number, item: any): number {
    return item.id;
  }
}
