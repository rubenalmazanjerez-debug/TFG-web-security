import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../service/auth';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // En el servidor dejamos pasar (el navegador decidirá)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Si el usuario YA está logueado, lo redirigimos a /students
  if (authService.isLoggedIn()) {
    router.navigate(['/students']);
    return false;
  }

  // Si NO está logueado, puede acceder al registro/login
  return true;
};
