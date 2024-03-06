import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRoutes } from '../../app.routes';

export function adminGuard(): CanActivateFn {
  return () => {
    const router: Router = inject(Router);
    const isUserAdmin = false;

    return isUserAdmin || router.createUrlTree([AppRoutes.AccessDenied]);
  };
}
