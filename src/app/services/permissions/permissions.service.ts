import { Injectable } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(private sidebarService: SidebarService) {}

  // check local storage

  // check permissions of user to access action in page in submodule of module
  checkPageActions(currentUser: any, code: string, action: string): boolean {
    if (currentUser?.isManager) {
      return true;
    } else {
      let roles: any[] = [];

      if (roles.length == 0) {
        this.sidebarService.getRoles().subscribe((role: any) => {
          // console.log(role);
          roles = role?.permissions;
        });
      }

      // check action if true
      let isAllowed = roles?.find(
        (role: any) => role?.page?.code === code && role[action] === true
      );
      if (isAllowed) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkPage(currentUser: any, code: string, action: string): boolean {
    if (currentUser?.isManager) {
      return true;
    } else {
      let roles: any = localStorage.getItem('mms-roles');
      let permissions: any[] = JSON.parse(roles)?.permissions;
      // check action if true
      let isAllowed = permissions?.find(
        (p: any) => p?.page?.code === code && p[action] === true
      );
      // console.log(isAllowed);
      if (isAllowed) {
        // store page code
        localStorage.setItem(
          'mms-pageId',
          JSON.stringify(isAllowed?.pageId)
        );
        return true;
      } else {
        return false;
      }
    }
  }
}
