import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
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
export class SidebarComponent implements OnInit, AfterViewInit {
  //variables
  sidebarLinks: any = [];
  isSidebarClosed: boolean = false;
  currentTheme: any;
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  role: any = null;

  sidebarMenus = {
    default: true,
  };

  constructor(
    private sidebarService: SidebarService,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router // private auth: AuthService
  ) {
    //call sidebar menus changes
    this.handleSidebarMenuChanges();
    //current language
    // this.getCurrentLanguage();
  }
  ngAfterViewInit(): void {
    // get active dropdown
    this.getActiveMenu();
    // this.getCurrentLanguage();
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
    this.getUserRoles();
  }

  // get current user
  getCurrentActiveUser() {
    // check local storage
    let user = localStorage.getItem('firelab-loginData');
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
    this.sidebarService.getSidebarMenuEnglish().subscribe((value: any[]) => {
      // console.log(menu);
      if (this.currentUser?.isManager) {
        this.sidebarLinks = value;
      } else {
        let newMenu: any[] = value[0]?.menu?.filter((link: any) => {
          if (link?.code != undefined) {
            let isMatch = this.checkPagePermission(link?.code);
            if (isMatch) {
              return link;
            }
          } else if (link?.list != undefined) {
            var newList = link.list?.filter((item: any) => {
              let isMatch = this.checkPagePermission(item?.code);
              if (isMatch) {
                return item;
              }
            });
            if (newList.length > 0) {
              return newList;
            }
          }
        });

        let newSidebar: any[] = [
          {
            menu: newMenu,
          },
        ];
        this.sidebarLinks = newSidebar;
      }
    });
  }
  //get sidebar menu ar
  getSidebarMenuInArabic() {
    // get sidebar links list from services
    this.sidebarService.getSidebarMenuArabic().subscribe((value: any[]) => {
      // console.log(menu);
      if (this.currentUser?.isManager) {
        this.sidebarLinks = value;
      } else {
        let newMenu: any[] = value[0]?.menu?.filter((link: any) => {
          if (link?.code != undefined) {
            let isMatch = this.checkPagePermission(link?.code);
            if (isMatch) {
              return link;
            }
          } else if (link?.list != undefined) {
            var newList = link.list?.filter((item: any) => {
              let isMatch = this.checkPagePermission(item?.code);
              if (isMatch) {
                return item;
              }
            });
            if (newList.length > 0) {
              return newList;
            }
          }
        });

        let newSidebar: any[] = [
          {
            menu: newMenu,
          },
        ];

        this.sidebarLinks = newSidebar;
      }
    });
  }

  getActiveMenu() {
    let currentPath = this.router.url;
    if (currentPath.includes('allCustomers')) {
    } else {
      // get sidebar links list from services
      this.sidebarService.getSidebarMenuEnglish().subscribe((sidebar) => {
        let id = this.searchByPath(sidebar[0]?.menu, currentPath);
        if (id) {
          this.sidebarService.activateDropdown(id);
        }
      });
    }
  }

  searchByPath(menu: any, searchPath: string) {
    // Loop through the menu and search for the path
    for (let item of menu) {
      // Check if this item has a path and if it matches the searchPath
      if (item?.list) {
        for (let subItem of item.list) {
          if (subItem.path && subItem.path === searchPath) {
            return item?.id;
          }
        }
      }
    }
    return null; // Return null if no matching path is found
  }

  getUserRoles() {
    if (this.currentUser?.isManager) {
      this.getCurrentLanguage();
      // nothing to do here
    } else {
      this.apiService
        .getById('teamMembers/roles', this.currentUser?.id)
        .subscribe({
          next: (data: any) => {
            //  set values
            console.log(data);
            if (data.isSuccess) {
              this.sidebarService.sendRoles(data?.value?.role);
              this.role = data?.value?.role;
              // store the token
              localStorage.setItem(
                'firelab-roles',
                JSON.stringify(data?.value?.role)
              );
            } else {
              this.router.navigate(['/modules/no-role']);
            }
          },
          error: (error) => {
            console.log('Roles Error', error);
            this.router.navigate(['/modules/no-role']);
            if (this.currentLanguage == 'ar') {
              this.toastr.error('هناك شيء خاطئ', 'خطأ');
            } else {
              this.toastr.error(error?.error[0]?.message, 'Error');
            }
          },
          complete: () => {
            this.getCurrentLanguage();
          },
        });
    }
  }

  // to enhance performance of loop when u remove or update item not render all items when changes happen
  trackFun(index: number, item: any): number {
    return item.id;
  }
  // check permissions of user to access page in submodule of sidebar menu
  checkCompaniesAccess(): boolean {
    if (this.currentUser?.isManager && this.currentUser?.company?.isSystem) {
      return true;
    } else {
      return false;
    }
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
