import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  showPassword: boolean = false;
  error: boolean = false;
  errorText: string = '';

  constructor(
    private themeService: ThemeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private toastr: ToastrService,
    private sidebarService: SidebarService,
    private auth: AuthService // private apiService: ApiService
  ) {
    // login form group controls
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  // convenience getter for easy access to form fields
  get formValues() {
    return this.loginForm.controls;
  }
  ngAfterViewInit(): void {
    this.getCurrentLanguage();
  }

  ngOnInit(): void {
    // set default theme
    this.themeService.setDefaultThemeSettings();
  }

  getCurrentLanguage() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
      this.currentLanguage = language;
      // turn on current language (trandlate)
      this.translateService.use(this.currentLanguage);
    });
  }

  // login function
  login() {
    this.loading = true;
    // login data
    let loginData: any = {
      ...this.loginForm.value,
      confirmPassword: this.loginForm.get('password')?.value,
    };

    let isTokenExist = false;
    // this.router.navigate(['/modules/dashboard']);

    this.auth.login('teamMembers/login', loginData).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          // check if ther is token
          if (data?.value?.token && data?.value?.userData) {
            // store the token
            localStorage.setItem(
              'firelab-loginData',
              JSON.stringify(data?.value)
            );
            isTokenExist = true;
            this.auth.currentUserSignal?.set(data);
          } else {
            // show erroe message
            this.toastr.error(
              'The Email or Password Incorrect Please Try Again'
            );
            this.error = true;
            this.errorText = 'The Email or Password Incorrect Please Try Again';
          }
        } else {
          console.log(data);
          this.toastr.error('There is something wrong with please try again');
          this.error = true;
          this.errorText = 'There is something wrong with please try again';
        }
      },
      error: (err) => {
        console.log(err);
        // show erroe message
        this.toastr.error(err?.error[0]?.message, 'Error');
        this.error = true;
        this.errorText = err?.error[0]?.message;
        // this.toastr.error('There is something wrong with please try again');
        // stop login btn loading
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      },
      complete: () => {
        if (isTokenExist) {
          this.getUserRoles();
          //  navigate to login after 2 sec
          setTimeout(() => {
            // stop login btn loading
            this.loading = false;
            this.router.navigate(['/modules/dashboard']);
            this.loginForm.reset();
            this.toastr.success('User Successfully Logged In', 'Success');
          }, 2000);
        }
      },
    });
  }
  openLink() {
    window.open('https://www.aktitec.com/');
  }

  getUserRoles() {
    this.sidebarService.getRoles().subscribe({
      next: (role: any) => {
        console.log(role);
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {},
    });
  }
}
