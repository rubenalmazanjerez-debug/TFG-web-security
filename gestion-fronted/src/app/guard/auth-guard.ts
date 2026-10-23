import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../service/auth';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const idStudentParam = route.paramMap.get('idStudent');
  const idStudentFromUrl = Number(idStudentParam);
  const currentStudentId = authService.getStudentId();

  if (idStudentParam === null || isNaN(idStudentFromUrl) || idStudentFromUrl !== currentStudentId) {
    router.navigate(['/', currentStudentId, 'students']);
    return false;
  }

  return true;
};
