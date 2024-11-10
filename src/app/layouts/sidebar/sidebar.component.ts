import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
//services
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  //variables
  sidebarLinks: any = [];
  isSidebarClosed: boolean = false;
  currentTheme: any;
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;

  sidebarMenus = {
    default: true,
  };

  constructor(
    private sidebarService: SidebarService,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private router: Router,
    // private auth: AuthService
  ) {
    //call sidebar menus changes
    this.handleSidebarMenuChanges();
    //current language
    this.getCurrentLanguage();
  }

  ngOnInit(): void {
    // get sidebar status (opend or closed)
    this.sidebarService.getSidebarStatus().subscribe((sidebarStatus) => {
      this.isSidebarClosed = sidebarStatus;
    });
    // get theme from localStorage
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
    // get user
    this.getCurrentActiveUser();
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
  //handle sidebar toggle in mobile mode
  sidebarToggle() {
    this.isSidebarClosed
      ? this.sidebarService.open()
      : this.sidebarService.close();
  }

  //handle pages route  changes to change sidebar menu
  handleSidebarMenuChanges() {
    // get routes changes to show  which sidebar menu in which page
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // const url = event.url.split('/');
          this.sidebarMenus.default = true;
      }
    });
  }
  //get current languge
  getCurrentLanguage() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
      this.currentLanguage = language;
      if (language == 'ar') {
        this.getSidebarMenuInArabic();
      } else {
        this.getSidebarMenuInEnglish();
      }
    });
  }
  //get sidebar menu en
  getSidebarMenuInEnglish() {
    // get sidebar links list from services
    this.sidebarService.getSidebarMenuEnglish().subscribe((menu) => {
      this.sidebarLinks = menu;
    });
  }
  //get sidebar menu ar
  getSidebarMenuInArabic() {
    // get sidebar links list from services
    this.sidebarService.getSidebarMenuArabic().subscribe((menu) => {
      this.sidebarLinks = menu;
    });
  }
  // to enhance performance of loop when u remove or update item not render all items when changes happen
  trackFun(index: number, item: any): number {
    return item.id;
  }
  // check permissions of user to access module sidebar menu
  checkModulePermissions(name: string) {
    // let module = this.currentUser?.role?.find(
    //   (module) => module?.name === name
    // );
    // if (module == undefined) {
    //   return false;
    // } else {
    //   return true;
    // }
    return true; // Return false if not found
  }
  // check permissions of user to access submodule sidebar menu
  checkSubModulePermissions(name: string) {
    // let modules = this.currentUser?.role;
    // for (const module of modules) {
    //   for (const subModule of module?.subModuleDto) {
    //     if (subModule?.name === name) {
    //       return true;
    //     }
    //   }
    // }
    return true; // Return false if not found
  }
  // check permissions of user to access page in submodule of sidebar menu
  checkPagePermissions(name: string) {
    // let modules = this.currentUser?.role;
    // for (const module of modules) {
    //   for (const subModule of module?.subModuleDto) {
    //     for (const page of subModule?.pageDto) {
    //       if (page?.name === name) {
    //         return true;
    //       }
    //     }
    //   }
    // }
    return true; // Return false if not found
  }
}
