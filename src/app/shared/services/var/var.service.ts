import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DefaultLayoutConfig, ILayoutConfig, TPageNames, TPageOrigins } from '../../models/layout.model';
import { Hosts, IHost } from '../../models/host.model';
import { ActivatedRoute, Router } from '@angular/router';
import { IUTMs } from '../../models/events.model';

@Injectable({
  providedIn: 'root'
})
export class VarService {
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
  fallBackImg = '/assets/images/fallback.svg';
  utms?: IUTMs = undefined;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

}
