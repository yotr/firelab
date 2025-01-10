import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SidebarService } from '../services/sidebar/sidebar.service';

export const roleGuard: CanActivateFn = (route, state) => {
  // services
  const sidebarService = inject(SidebarService);
  const router = inject(Router);

  // check if user is logged in
  let haveRole = sidebarService.getRoles() == undefined ? false : true;

  if (haveRole) {
    router.navigate(['/modules/dashboard']);
    return false;
  } else {
    return true;
  }
};
