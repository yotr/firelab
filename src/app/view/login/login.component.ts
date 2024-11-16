import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
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

  constructor(
    private themeService: ThemeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private toastr: ToastrService,
    private auth: AuthService
  ) // private apiService: ApiService
  {
    // login form group controls
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngAfterViewInit(): void {
    this.getCurrentLanguage();
  }

  ngOnInit(): void {
    //initialize login form default values
    // this.loginForm.setValue({
    //   email: 'example@example.com',
    //   password: '12345',
    // });
    // set default theme
    this.themeService.setDefaultThemeSettings();
    // console.log(this.currentLanguage);
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
      // email: this.loginForm.get('email').value,
      // password: this.loginForm.get('password').value,
    };

    let isTokenExist = false;
    this.router.navigate(['/modules/dashboard']);

    // this.auth.login('users/login', loginData).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     // check if ther is token
    //     if (data?.token && data?.userData) {
    //       // store the token
    //       localStorage.setItem('firelab-loginData', JSON.stringify(data));
    //       // this.auth.currentUserSignal?.set(data);
    //       isTokenExist = true;
    //       this.auth.currentUserSignal?.set(data);
    //     } else {
    //       // show erroe message
    //       this.toastr.error('The Email or Password Incorrect Please Try Again');
    //     }
    //   },
    //   error: (err) => {
    //     // show erroe message
    //     this.toastr.error('There is something wrong with please try again');
    //     // stop login btn loading
    //     setTimeout(() => {
    //       this.loading = false;
    //       // this.loginForm.reset();
    //     }, 2000);
    //   },
    //   complete: () => {
    //     if (isTokenExist) {
    //       //  navigate to login after 2 sec
    //       setTimeout(() => {
    //         // stop login btn loading
    //         this.loading = false;
    //         this.router.navigate(['/modules/dashboard/employee-dashboard']);
    //         this.loginForm.reset();
    //         this.toastr.success('User Successfully Logged In', 'Success');
    //       }, 2000);
    //     }
    //   },
    // });
  }
  openLink() {
    window.open('https://www.aktitec.com/');
  }
}
