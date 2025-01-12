import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const companyGuard: CanActivateFn = (route, state) => {
  // services
  const authService = inject(AuthService);
  const router = inject(Router);

  // check if user is logged in
  let isLoggedIn = authService.currentUserSignal() == undefined ? false : true;
  let user = authService.currentUserSignal()?.userData;

  if (isLoggedIn && user?.isManager && user?.company?.isSystem) {
    return true;
  } else {
    router.navigate(['/modules/profile']);
    return false;
  }
};
