import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from './services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './services/theme/theme.service';
import { AuthService } from './services/auth/auth.service';
import { SidebarService } from './services/sidebar/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'firelab';
  currentTheme: any;
  // current language
  currentLanguage: any = localStorage.getItem('lang');

  constructor(
    private themeService: ThemeService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private auth: AuthService,
    private toastr: ToastrService,
    private sidebarService: SidebarService
  ) {
    // turn on current language (trandlate)
    this.translateService.use(this.currentLanguage);
    // this.titleService.setTitle(this.title);
    // check local storage
    let user = localStorage.getItem('mms-loginData');
    if (user) {
      // this.signalRService.startConnection();
      // signal R connection test
    }
  }

  ngOnInit(): void {
    // set default theme
    this.themeService.setDefaultThemeSettings();
    this.themeService.getCurrentTheme().subscribe((theme: any) => {
      this.currentTheme = JSON.parse(theme);
    });

    // set default language
    this.languageService.setDefaultLanguage();
    this.getCurrentLanguage();
    // get user
    this.getCurrentActiveUser();
  }

  ngAfterViewInit(): void {
    // this.getUserRoles();
    // this.whenCallMsgComeing();
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
    } else {
    }
  }
}
