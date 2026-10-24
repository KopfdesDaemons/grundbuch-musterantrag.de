import { provideServerRendering, withRoutes } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig, inject, REQUEST } from '@angular/core';
import { HttpInterceptorFn, ɵHTTP_ROOT_INTERCEPTOR_FNS as HTTP_ROOT_INTERCEPTOR_FNS } from '@angular/common/http';
import { appConfig } from './app.config';
import { serverRoutes } from './routes/app.routes.server';

const ssrLocalApiInterceptor: HttpInterceptorFn = (req, next) => {
  const localOrigin = process.env['SSR_LOCAL_ORIGIN'];
  if (!localOrigin || !req.url.startsWith('/api/')) {
    return next(req);
  }

  const incomingReq = inject(REQUEST, { optional: true });
  const forwardedFor = incomingReq?.headers.get('x-forwarded-for');
  const setHeaders: Record<string, string> = {};

  if (forwardedFor && !req.headers.has('x-forwarded-for')) {
    setHeaders['x-forwarded-for'] = forwardedFor;
  }

  return next(
    req.clone({
      url: `${localOrigin}${req.url}`,
      setHeaders
    })
  );
};

const serverConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_ROOT_INTERCEPTOR_FNS,
      useValue: ssrLocalApiInterceptor,
      multi: true
    },
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
