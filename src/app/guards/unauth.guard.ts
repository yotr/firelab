import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const unauthGuard: CanActivateFn = (route, state) => {
  // services
  const authService = inject(AuthService);
  const router = inject(Router);

  // check if user is logged in
  let isLoggedIn = authService.currentUserSignal() == undefined ? false : true;

  if (!isLoggedIn) {
    return true;
  } else {
    router.navigate(['/modules/dashboard']);
    return false;
  }
};
