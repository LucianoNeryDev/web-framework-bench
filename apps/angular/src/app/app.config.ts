import { APP_BASE_HREF } from '@angular/common';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // No <base href>: it would turn the skip link's "#main" into "/#main" on every page.
    { provide: APP_BASE_HREF, useValue: '/' },
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
  ],
};
