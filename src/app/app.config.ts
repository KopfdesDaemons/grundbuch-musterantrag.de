import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: "top",
                anchorScrolling: 'enabled',
            }),
        ),
        importProvidersFrom(BrowserModule, FontAwesomeModule, FormsModule, ReactiveFormsModule),
        provideHttpClient(),
        provideClientHydration(withIncrementalHydration()),
    ],
};