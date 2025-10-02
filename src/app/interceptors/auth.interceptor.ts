import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { from, Observable, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Check if user is logged in. If not, pass the request through without modification.
  if (localStorage.getItem('login') !== 'true') return next(req);

  if (req.url.startsWith('/api/auth/refresh')) return next(req);

  const handleRequest = (): Observable<HttpEvent<unknown>> => {
    // Check if the request URL starts with the API base URL
    const isApiRequest = req.url.startsWith('/api/');

    if (isApiRequest && authService.accessToken()) {
      const reqWithAuth = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authService.accessToken()}`
        }
      });
      return next(reqWithAuth);
    }

    // If it's not an API request, or there is no access token, proceed without modification
    return next(req);
  };

  const accessTokenExpireDate = authService.accessTokenExpiryDate ? new Date(authService.accessTokenExpiryDate.getTime() - 10 * 1000) : null; // 10 seconds buffer
  const sessionPromise = !accessTokenExpireDate || accessTokenExpireDate < new Date() ? authService.restoreSession() : Promise.resolve();

  return from(sessionPromise).pipe(switchMap(() => handleRequest()));
};
