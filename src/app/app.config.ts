import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './routes/app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/user/auth.service';

const initApp = async () => {
  const authService = inject(AuthService);
  try {
    await authService.restoreSession();
  } catch (e) {
    console.error('Fehler bei der Wiederherstellung der Session:', e);
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),
    provideAppInitializer(initApp),
    importProvidersFrom(BrowserModule, FormsModule, ReactiveFormsModule),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideClientHydration(withIncrementalHydration()),
    provideZonelessChangeDetection()
  ]
};
