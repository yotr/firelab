import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { PermissionsService } from '../services/permissions/permissions.service';

export const customersGuard: CanActivateFn = (route, state) => {
  // services
  const auth = inject(AuthService);
  const permissionsService = inject(PermissionsService);
  const router = inject(Router);

  let user: any = localStorage.getItem('firelab-loginData');
  // check if user is logged in
  let isAllowed = permissionsService.checkPage(
    JSON.parse(user)?.userData,
    'CRMM2P1'
  );

  if (isAllowed) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
