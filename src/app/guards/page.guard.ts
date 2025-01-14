import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '../services/permissions/permissions.service';
import { ToastrService } from 'ngx-toastr';

export const pageGuard: CanActivateFn = (route, state) => {
  // services
  const toastr = inject(ToastrService);
  const permissionsService = inject(PermissionsService);
  const router = inject(Router);
  const code: any = route.data['code'];
  const action: any = route.data['action'];
  const user: any = localStorage.getItem('firelab-loginData');
  const currentLanguage: any = localStorage.getItem('lang');

  let isAllowed = permissionsService.checkPage(
    JSON.parse(user)?.userData,
    code,
    action
  );

  if (isAllowed) {
    return true;
  } else {
    if (currentLanguage == 'ar') {
      toastr.warning('لا يمكنك الوصول إلى هذه الصفحة');
    } else {
      toastr.warning("you can't access this page");
    }
    router.navigate(['/login']);
    return false;
  }
};
