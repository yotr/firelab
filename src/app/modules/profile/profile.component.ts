import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  currentTheme: any;
  addForm: FormGroup;
  data: any = {};
  loading: boolean = true;
  currentLanguage: any = localStorage.getItem('lang');
  customerId: any = null;
  uploading: boolean = false;
  currentUser: any = null;
  userImage = 'assets/img/user.jpg';

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private auth: AuthService
  ) {
    // form
    this.addForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      contactNumber: ['', [Validators.required]],
      billableHourlyRate: ['', [Validators.required]],
      position: [''],
      division: [''],
      status: ['clocked'],
      roleId: [null],
    });
  }
  // convenience getter for easy access to form fields
  get formValues() {
    return this.addForm.controls;
  }

  ngOnInit() {
    this.getTheme();
    this.getCurrentLanguage();
    this.getCurrentActiveUser();
  }

  ngAfterViewInit(): void {
    this.getCurrentData();
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
    this.apiService.getById('teamMembers', this.currentUser?.id).subscribe({
      next: (data: any) => {
        //  set values
        console.log(data);
        this.addForm.patchValue({
          firstName: data?.firstName,
          lastName: data?.lastName,
          userName: data?.userName,
          email: data?.email,
          contactNumber: data?.contactNumber,
          billableHourlyRate: data?.billableHourlyRate,
          position: data?.position,
          division: data?.division,
          roleId: data?.roleId,
        });
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
    // if (this.editForm.valid) {
    //   let data = {
    //     ...this.editForm.value,
    //   };
    //   console.log(data);
    //   this.uploading = true;
    //   // api
    //   this.apiService?.update('customers', this.customerId, data).subscribe({
    //     next: (data) => {
    //       console.log(data);
    //       if (data?.isSuccess) {
    //         if (this.currentLanguage == 'ar') {
    //           this.toastr.success('تمت إضافة البيانات بنجاح...');
    //         } else {
    //           this.toastr.success('data added successfully...', 'Success');
    //         }
    //         // this.router.navigate(['/modules/customers/allCustomers']);
    //       }
    //     },
    //     error: (err: any) => {
    //       if (this.currentLanguage == 'ar') {
    //         this.toastr.error('هناك شيء خاطئ', 'خطأ');
    //       } else {
    //         this.toastr.error('There Is Somthing Wrong', 'Error');
    //       }
    //       this.uploading = false;
    //     },
    //     complete: () => {
    //       this.uploading = false;
    //     },
    //   });
    // } else {
    //   if (this.currentLanguage == 'ar') {
    //     this.toastr.warning('الرجاء إدخال الحقول المطلوبة');
    //   } else {
    //     this.toastr.warning('Please enter the required fields');
    //   }
    // }
  }
}
