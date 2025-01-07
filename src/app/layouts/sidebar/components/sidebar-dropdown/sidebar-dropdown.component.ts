import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthService } from 'src/app/services/auth/auth.service';
//services
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
@Component({
  selector: 'app-sidebar-dropdown',
  templateUrl: './sidebar-dropdown.component.html',
  styleUrls: ['./sidebar-dropdown.component.css'],
  animations: [
    trigger('toggle-animation', [
      state(
        'closed',
        style({
          maxHeight: '0px',
        })
      ),
      state(
        'opened',
        style({
          maxHeight: '1000px',
        })
      ),
      transition('closed => opened', [animate('0.4s')]),
      transition('opened => closed', [animate('0.4s')]),
    ]),
  ],
})
export class SidebarDropdownComponent implements OnInit {
  //variables
  activeMenu = {
    value: '',
  };

  isSidebarClosed: boolean = false;
  displaySubmenu: boolean = false;
  displaySubmenuBack: boolean = true;

  @Input() list: any;
  @Input() currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;
  currentUser: any = null;

  constructor(
    private sidebarService: SidebarService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    // get sidebar status (is closed or opened)
    // this.sidebarService.getSidebarStatus().subscribe((sidebarService) => {
    //   this.isSidebarClosed = sidebarService;
    // });
    // active dropdown
    this.sidebarService.getActiveDropdownValue().subscribe((value: any) => {
      this.activeMenu.value = value;
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
    let user = localStorage.getItem('firelab-loginData');
    // if exist
    if (user) {
      // this.auth.currentUserSignal.set(JSON.parse(user));
      this.currentUser = JSON.parse(user)?.userData;
    } else {
    }
  }
  //handle display submenu from list menu array by know which item active
  handleActiveMenu(activeValue: string) {
    this.sidebarService.sendActiveDropdown(activeValue);
  }
  //handle submenu back cover div to remove submenu when u click on document
  closeActiveMenu() {
    this.sidebarService.sendActiveDropdown('');
  }
  // to enhance loop when u remove or update item not render all items
  trackFun(index: number, item: any): number {
    return item.id;
  }
  // check permissions of user to access page in submodule of sidebar menu
  checkPagePermissions(code: string) {
    // this.sidebarService.getRoles().subscribe((role: any) => {
    //   let pages: any[] = role?.permissions;
    //   pages.forEach((value: any) => {
    //     if (value?.page?.code === code) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   });
    // });
  }
}
