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
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.css'],
})
export class AddPermissionComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  uploading: boolean = false;

  // modules
  modules: any[] = [];
  modulesLoading: boolean = true;
  getDataError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService,
    private auth: AuthService
  ) {
    // Add form
    this.addForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      // arabicName: ['', [Validators.required]],
    });
  }
  ngAfterViewInit(): void {
    this.getModules();
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
    let user = localStorage.getItem('mms-loginData');
    // if exist
    if (user) {
      this.auth.currentUserSignal.set(JSON.parse(user));
      this.currentUser = JSON.parse(user)?.userData;
    } else {
    }
  }

  // get Modules data
  getModules() {
    this.apiService.get('modules').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.modules = data?.value;
          this.getDataError = false;
        }
        this.modulesLoading = false;
      },
      error: (err) => {
        this.modules = [];
        this.modulesLoading = false;
        this.getDataError = true;
        console.log(err);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
        this.modulesLoading = false;
      },
      complete: () => {
        this.modulesLoading = false;
      },
    });
  }

  //add a new
  submit() {
    // selected pages in modules
    const selectedPages = this.modules.flatMap((module: any) =>
      module?.pages
        .filter((page: any) => page.read)
        .map((page: any) => ({
          pageId: page?.id,
          read: page?.read,
          create: page?.create,
          update: page?.update,
          delete: page?.delete,
        }))
    );

    if (this.addForm.valid && selectedPages.length > 0) {
      let data = {
        ...this.addForm.value,
        permissions: selectedPages,
      };

      console.log(data);
      this.uploading = true;
      // api
      this.apiService.add('roles/add', data).subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            this.router.navigate(['/modules/permissions']);
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
}
