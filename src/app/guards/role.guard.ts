import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserType } from '../models/auth.models';
import { AuthPocketbaseService } from '../services/auth-pocketbase.service';

export const roleGuard: CanActivateFn = async (route) => {
  const auth = inject(AuthPocketbaseService);
  const router = inject(Router);
  const user = auth.getCurrentUser() || (await auth.refreshSession());
  const allowedTypes = (route.data?.['types'] || []) as UserType[];

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (auth.isBlockedOrInactive(user)) {
    auth.logout();
    return router.createUrlTree(['/login']);
  }

  if (allowedTypes.length === 0 || auth.hasRole(allowedTypes)) {
    return true;
  }

  return router.createUrlTree([auth.getRedirectPath(user.type)]);
};
