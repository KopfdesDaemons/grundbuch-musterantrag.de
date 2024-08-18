import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes),
    importProvidersFrom(BrowserModule, FontAwesomeModule, FormsModule, ReactiveFormsModule),
    provideHttpClient(),
    provideClientHydration(),
    ],
};