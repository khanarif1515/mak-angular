import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ApiService, AuthService, EventService, PaymentService, ScriptLoaderService, SeoService, StorageService, UtilService, VarService } from './shared/services';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './shared/services/http-intercept/http-intercept.interceptor';

const Services = [
  ApiService,
  AuthService,
  EventService,
  PaymentService,
  ScriptLoaderService,
  SeoService,
  StorageService,
  UtilService,
  VarService
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([httpInterceptor])),
    ...Services
  ]
};
