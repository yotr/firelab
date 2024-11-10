import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';

//services
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.css'],
})
export class HeaderSearchComponent implements OnInit, AfterViewInit {
  //variables
  @Input() currentLanguage: any = localStorage.getItem('lang');
  data: any[] = [];
  results: any[] = [];
  currentTheme: any;
  // current language
  searchText: string = '';
  currentUser: any = null;

  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService,
    private router: Router,
    private translateService: TranslateService,
    private languageService: LanguageService,
    // private auth: AuthService
  ) {
    this.getCurrentLanguage();
    // turn on current language (trandlate)
    // this.translateService.use(this.currentLanguage);
    // get user
    this.getCurrentActiveUser();
  }

  ngAfterViewInit(): void {
    // this.getCurrentLanguage();
  }

  // get current user
  getCurrentActiveUser() {
    // check local storage
    let user = localStorage.getItem('loginData');
    // if exist
    if (user) {
      // this.auth.currentUserSignal.set(JSON.parse(user));
      this.currentUser = JSON.parse(user)?.userData;
    } else {
    }
  }

  ngOnInit() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
      this.currentLanguage = language;
    });
    // get theme from localStorage
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });

    // this.getSidebarDataByLanguage();

    // turn on current language (trandlate)
  }

  getCurrentLanguage() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
      this.currentLanguage = language;
      if (this.currentLanguage == 'ar') {
        this.getSidebarMenuInArabic();
      } else {
        this.getSidebarMenuInEnglish();
      }
      // turn on current language (trandlate)
      // this.translateService.use(this.currentLanguage);
    });
  }
  // get sidebar search data depend on language
  //get current languge
  getSidebarDataByLanguage() {
    if (this.currentLanguage == 'ar') {
      this.getSidebarMenuInArabic();
    } else {
      this.getSidebarMenuInEnglish();
    }
  }
  //get sidebar menu en
  getSidebarMenuInEnglish() {
    // get sidebar links list from services
    this.sidebarService.getSidebarMenuEnglish().subscribe((menu) => {
      this.data = menu;
    });
  }
  //get sidebar menu ar
  getSidebarMenuInArabic() {
    // get sidebar links list from services
    this.sidebarService.getSidebarMenuArabic().subscribe((menu) => {
      this.data = menu;
    });
  }

  resetData() {
    this.searchText = '';
  }

  // to enhance performance of loop when u remove or update item not render all items when changes happen
  trackFun(index: number, item: any): number {
    return item.id;
  }
  // check permissions of user to access page in submodule of sidebar menu
  checkPagePermissions(name: string) {
    let modules = this.currentUser?.role;
    if (this.currentUser?.isAdmin) {
      return true;
    } else {
      for (const module of modules) {
        for (const subModule of module?.subModuleDto) {
          for (const page of subModule?.pageDto) {
            if (page?.name === name) {
              return true;
            }
          }
        }
      }
      return false; // Return false if not found
    }
  }
}
