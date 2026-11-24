import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../service/auth';

export const adminGuard: CanActivateFn = (): boolean => {
  const auth: Auth = inject(Auth);
  const router: Router = inject(Router);

  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  if (auth.isLoggedIn() && auth.isAdmin()) {
    return true;
  }

  alert('Access denied. Only administrators can view this page.');
  router.navigate(['/', auth.getStudentId(), 'social-plans']);
  return false;
};
