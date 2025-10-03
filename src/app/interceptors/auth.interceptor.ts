import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { from, Observable, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  if (localStorage.getItem('login') !== 'true' || !req.url.startsWith('/api/') || req.url.startsWith('/api/auth/login')) {
    return next(req);
  }

  if (req.url.startsWith('/api/auth/refresh')) return next(req);

  const isTokenExpired = (): boolean => {
    const expiryDate = authService.accessTokenExpiryDate;
    if (!expiryDate) return true;
    // 10 seconds buffer
    return new Date(expiryDate.getTime() - 10 * 1000) < new Date();
  };

  const addToken = (request: HttpRequest<unknown>): HttpRequest<unknown> => {
    const token = authService.accessToken();
    if (!token) return request;
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  if (isTokenExpired()) {
    return from(authService.restoreSession()).pipe(
      switchMap(() => {
        return next(addToken(req));
      })
    );
  } else {
    return next(addToken(req));
  }
};
