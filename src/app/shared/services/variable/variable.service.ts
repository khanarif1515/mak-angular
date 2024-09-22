import { Injectable } from '@angular/core';
import { IHost } from '../../models/host.model';
import { ILayoutConfig, IPageNames, IPageOrigins } from '../../models/layout-config.model';
import { MetaDefinition } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class VariableService {
  authToken = '';
  deviceType = '';
  domain_details!: IHost;
  isBrowser = false;
  isMobile = false;

  origin: IPageOrigins = '';
  pageLayoutConfig?: ILayoutConfig;
  pageName: IPageNames = 'blank';
  currentUrlPath = '';
  previousUrlPath = '';
  seoMetaTags: MetaDefinition[] = [];
  utm_url_obj: any;
  utm_url_string = '';

  constructor() { }
}
