import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { from, Observable, switchMap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  // Don't intercept non-API requests, login requests, logout requests, or refresh requests
  if (
    !req.url.startsWith('/api/') ||
    req.url.startsWith('/api/auth/login') ||
    req.url === '/api/auth/logout' ||
    req.url.startsWith('/api/auth/refresh')
  ) {
    return next(req);
  }

  if (isPlatformBrowser(platformId)) {
    if (localStorage.getItem('login') !== 'true') {
      return next(req);
    }
  } else {
    if (!authService.accessToken()) {
      return next(req);
    }
  }

  const accessTokenIsExpired = (): boolean => {
    const expiryDate = authService.accessTokenExpiryDate;

    // Return expired if there is no expiry date
    if (!expiryDate) return true;

    // 10 seconds buffer
    const isValidForLessThan10Seconds = new Date(expiryDate.getTime() - 10 * 1000) < new Date();
    return isValidForLessThan10Seconds;
  };

  const addAccessTokenToAuthHeader = (request: HttpRequest<unknown>): HttpRequest<unknown> => {
    // Get the access token from the auth service
    const accessToken = authService.accessToken();
    if (!accessToken) return request;

    // Add the access token to the auth header
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

  if (accessTokenIsExpired()) {
    // Refresh the token before request
    return from(authService.restoreSessionAndSetNewAccessToken()).pipe(
      switchMap(() => {
        return next(addAccessTokenToAuthHeader(req));
      })
    );
  } else {
    // Add the valid access token before request
    return next(addAccessTokenToAuthHeader(req));
  }
};
