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
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.css'],
})
export class EditTeamComponent implements OnInit, AfterViewInit {
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
  updateId: any = null;
  // roles
  roles: any[] = [];
  rolesLoading: boolean = true;
  assignedRole: any = null;
  isManager: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
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
    this.addForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        userName: [''],
        email: ['', [Validators.email, Validators.required]],
        // password: [''],
        contactNumber: ['', [Validators.required]],
        billableHourlyRate: ['', [Validators.required]],
        position: [''],
        reportCategoryId: [null],
        roleId: [null],
      }
      // { validators: passwordMatch }
    );
  }
  get formValues() {
    return this.addForm.controls;
  }
  ngAfterViewInit(): void {
    this.getCurrentData();
  }

  ngOnInit() {
    this.getTheme();
    this.getCurrentLanguage();
    this.getCurrentActiveUser();
    this.getRoles();
    this.getCategories();
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

  // get current data
  getCurrentData() {
    this.apiService.getById('teamMembers', this.updateId).subscribe({
      next: (data: any) => {
        //  set values
        console.log(data);
        this.addForm.patchValue({
          firstName: data?.firstName,
          lastName: data?.lastName,
          userName: data?.userName,
          email: data?.email,
          // password: data?.password,
          contactNumber: data?.contactNumber,
          billableHourlyRate: data?.billableHourlyRate,
          position: data?.position,
          division: data?.division,
          roleId: data?.roleId,
          reportCategoryId: data?.reportCategoryId,
        });
        this.assignedRole = data?.roleId;
        this.isManager = data?.isManager;
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
  onFilterRoles(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('Roles/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.roles = data?.value;
              // this.totalItemsCount = data?.value?.length;
            }
            this.rolesLoading = false;
          },
          error: (err: any) => {
            this.rolesLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getRoles();
    }
  }

  //add a new
  submit() {
    const isFormChanged = this.addForm.dirty;

    if (isFormChanged) {
      if (this.addForm.valid) {
        let data = {
          ...this.addForm.value,
        };
        console.log(data);
        this.uploading = true;
        // api
        this.apiService.update('teamMembers', this.updateId, data).subscribe({
          next: (data) => {
            console.log(data);
            if (data?.isSuccess) {
              if (this.currentLanguage == 'ar') {
                this.toastr.success('تمت إضافة البيانات بنجاح...');
              } else {
                this.toastr.success('data added successfully...', 'Success');
              }

              this.router.navigate(['/modules/team/allTeam']);
            }
          },
          error: (err: any) => {
            console.log('Error: ' + err);
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
    } else {
      console.log('No changes in the form');
      history.back();
    }
  }
}
