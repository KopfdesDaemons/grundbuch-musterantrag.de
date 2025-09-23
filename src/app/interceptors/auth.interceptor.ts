import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/user/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authS = inject(AuthService);

  // Check if an auth token exists
  if (!authS.authToken) {
    return next(req);
  }

  // Check if the request URL starts with the API base URL
  const isApiRequest = req.url.startsWith('/api/');

  if (isApiRequest) {
    const reqWithAuth = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authS.authToken}`
      }
    });
    return next(reqWithAuth);
  }

  // If it's not a request to your API, proceed without modification
  return next(req);
};
