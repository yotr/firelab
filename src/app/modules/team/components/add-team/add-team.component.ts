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
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css'],
})
export class AddTeamComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  firstStep: boolean = true;
  secondStep: boolean = false;
  currentUser: any = null;
  // categories
  categories: any[] = [];
  categoriesLoading: boolean = true;
  // defaultPermissions: Permission[];
  uploading: boolean = false;

  // roles
  roles: any[] = [];
  rolesLoading: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService
  ) {
    // Add form
    this.addForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        // userName: ['', [Validators.required]],
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required]],
        contactNumber: ['', [Validators.required]],
        billableHourlyRate: ['', [Validators.required]],
        position: [''],
        reportCategoryId: [null],
        status: ['clocked'],
        roleId: [null],
      }
      // { validators: passwordMatch }
    );
  }
  get formValues() {
    return this.addForm.controls;
  }
  ngAfterViewInit(): void {
    this.getCategories();
    this.getRoles();
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
    let user = localStorage.getItem('firelab-loginData');
    // if exist
    if (user) {
      this.auth.currentUserSignal.set(JSON.parse(user));
      this.currentUser = JSON.parse(user)?.userData;
    } else {
    }
  }

  nextStep() {
    this.firstStep = false;
    this.secondStep = true;
  }
  changeStep(step: number) {
    if (step === 1) {
      this.firstStep = true;
      this.secondStep = false;
    } else if (step === 2) {
      this.firstStep = false;
      this.secondStep = true;
    } else {
    }
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

  //add a new
  submit() {
    if (this.addForm.valid) {
      let fName = this.addForm.get('firstName')?.value;
      let lName = this.addForm.get('lastName')?.value;
      let username = fName + '_' + lName;
      let data = {
        ...this.addForm.value,
        userName: username,
        CompanyId: this.currentUser?.companyId,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService?.add('teamMembers/add', data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }

            this.router.navigate(['/modules/team/allTeam']);
          } else {
            this.uploading = false;
            if (this.currentLanguage == 'ar') {
              this.toastr.error(
                'يجب ألا تكون هناك مسافات فارغه ف الاسم الاول والاخير'
              );
            } else {
              this.toastr.error(
                'There should be no space in the first and last name.',
                'Error'
              );
            }
          }
        },
        error: (err: any) => {
          console.log('Error:', err);
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
