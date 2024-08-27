import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { HttpInterService } from './shared/services/http-inter/http-inter.interceptor';
import { ABService, ApiService, EventsService, ScriptLoaderService, SeoService, StorageService, UtilService, VariablesService } from './shared/services';

const Services = [
  ABService,
  ApiService,
  EventsService,
  ScriptLoaderService,
  SeoService,
  StorageService,
  UtilService,
  VariablesService
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterService, multi: true },
    provideAnimationsAsync(),
    ...Services
  ]
};
