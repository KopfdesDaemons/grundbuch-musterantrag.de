import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/user/auth.service';
import { environment } from 'src/app/environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authS = inject(AuthService);

  if (!authS.authToken) {
    return next(req);
  }

  try {
    const uri = new URL(req.url);
    console.log('req.url: ' + req.url);
    console.log('uri.hostname: ' + uri.hostname);
    console.log('environment.hostname: ' + environment.hostname);

    // Check if hostname matches the production hostname
    if (uri.hostname === environment.hostname || uri.hostname === 'www.' + environment.hostname) {
      return setAuthHeader();
    }
  } catch {
    // New URL will fail if localhost
    if (!environment.production) return setAuthHeader();
    else return next(req);
  }

  return next(req);

  function setAuthHeader() {
    const reqWithAuth = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authS.authToken}`
      }
    });

    return next(reqWithAuth);
  }
};
