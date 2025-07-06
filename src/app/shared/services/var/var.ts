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
