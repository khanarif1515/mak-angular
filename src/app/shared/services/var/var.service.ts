import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultLayoutConfig, ILayoutConfig, TPageNames, TPageOrigins } from '../../models/layout.model';
import { Hosts, IHost } from '../../models/host.model';
import { IUTMs } from '../../models/events.model';

@Injectable({
  providedIn: 'root'
})
export class VarS {

  readonly actRoute = inject(ActivatedRoute);
  readonly document = inject(DOCUMENT);
  readonly platformId = inject(PLATFORM_ID);
  readonly router = inject(Router);

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
  currency = 'INR';
  currentUrl = '';
  deviceType = '';
  previousUrl = '';
  hostData: IHost = Hosts['default'];
  isBrowser = false;
  isMobile = false;
  layoutConfig: ILayoutConfig = DefaultLayoutConfig;
  origin: TPageOrigins = '';
  pageName: TPageNames = '';
  fallBackImg = '/images/fallback.svg';
  utms?: IUTMs = undefined;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

}
