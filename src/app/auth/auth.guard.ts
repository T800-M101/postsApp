import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const isUserLoggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  let userIsAunthenticated = false;

  authService.getAuthStatusListener().subscribe(isAuthenticated => {
      userIsAunthenticated = isAuthenticated;
  });
  return userIsAunthenticated ? true : false;
};



