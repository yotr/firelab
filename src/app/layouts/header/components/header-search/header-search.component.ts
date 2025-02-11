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
  role: any = null;
  currentTheme: any;
  // current language
  searchText: string = '';
  currentUser: any = null;

  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService,
    private router: Router,
    private translateService: TranslateService,
    private languageService: LanguageService // private auth: AuthService
  ) {
    // this.getCurrentLanguage();
    // turn on current language (trandlate)
    // this.translateService.use(this.currentLanguage);
    // get user
    this.getCurrentActiveUser();
  }

  ngAfterViewInit(): void {
    this.getCurrentLanguage();
  }

  // get current user
  getCurrentActiveUser() {
    // check local storage
    let user = localStorage.getItem('mms-loginData');
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
    this.getUserRoles();

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
    this.sidebarService.getSidebarMenuEnglish().subscribe((value: any[]) => {
      // console.log(menu);
      if (this.currentUser?.isManager) {
        this.data = value;
      } else {
        let newMenu: any[] = value[0]?.menu?.filter((link: any) => {
          if (link?.code != undefined) {
            let isMatch = this.checkPagePermission(link?.code);
            if (isMatch) {
              return link;
            }
          } else if (link?.list != undefined) {
            link?.list?.filter((item: any) => {
              let isMatch = this.checkPagePermission(item?.code);
              if (isMatch) {
                return link;
              }
            });
          }
        });

        let newSidebar: any[] = [
          {
            menu: newMenu,
          },
        ];
        this.data = newSidebar;
      }
    });
  }
  //get sidebar menu ar
  getSidebarMenuInArabic() {
    // get sidebar links list from services
    this.sidebarService.getSidebarMenuArabic().subscribe((value: any[]) => {
      // console.log(menu);
      if (this.currentUser?.isManager) {
        this.data = value;
      } else {
        let newMenu: any[] = value[0]?.menu?.filter((link: any) => {
          if (link?.code != undefined) {
            let isMatch = this.checkPagePermission(link?.code);
            if (isMatch) {
              return link;
            }
          } else if (link?.list != undefined) {
            link?.list?.filter((item: any) => {
              let isMatch = this.checkPagePermission(item?.code);
              if (isMatch) {
                return link;
              }
            });
          }
        });

        let newSidebar: any[] = [
          {
            menu: newMenu,
          },
        ];

        this.data = newSidebar;
      }
    });
  }
  getUserRoles() {
    this.sidebarService.getRoles().subscribe({
      next: (role: any) => {
        this.role = role;
        console.log(role);
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {},
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
  checkPagePermission(code: string): boolean {
    let pages: any[] = this.role?.permissions;
    if (pages != undefined) {
      let isExist = pages?.find((v) => v?.page?.code == code);
      if (isExist === undefined) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
