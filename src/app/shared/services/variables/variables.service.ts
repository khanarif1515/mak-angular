import { DOCUMENT, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ALL_DOMAINS, IDomain } from '../../models/domain';
import { ActivatedRoute, Router } from '@angular/router';
import { IUTMs } from '../../models/event.model';
import { isPlatformBrowser } from '@angular/common';
import { DefaultLayoutConfig, ILayoutConfig, TPageNames, TPageOrigins } from '../../models/layout.model';
import { IUser } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class VariablesService {
  readonly actRoute = inject(ActivatedRoute);
  readonly document = inject(DOCUMENT);
  readonly platformId = inject(PLATFORM_ID);
  readonly router = inject(Router);

  hostData: IDomain = ALL_DOMAINS['default'];
  isBrowser = false;
  isMobile = false;
  deviceType = '';
  currentUrl = '';
  previousUrl = '';
  origin: TPageOrigins = '';
  pageName: TPageNames = '';
  layoutConfig: ILayoutConfig = DefaultLayoutConfig;
  utms?: IUTMs = undefined;
  user?: IUser = undefined;
  maskedUser?: IUser = undefined;
  globalVar = signal<Record<string, any>>({});


  regex = {
    name: /^[a-z ']+$/i,
    email: /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/,
    stringOnly: /^[a-zA-Z\s]+$/,
    numberOnly: /^\d+(\.\d+)?$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s)[A-Za-z\d\W]{8,12}$/,
    userName: /^(?=[a-z0-9._]+$)([^._]*\.){0,1}([^._]*_){0,1}[^._]*$/,
    dob: /^\d{4}-\d{2}-\d{2}$/,
    dialCode: /^\+\d{1,5}$/
  };

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

}
