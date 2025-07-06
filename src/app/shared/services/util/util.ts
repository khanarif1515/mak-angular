import { inject, Injectable } from '@angular/core';
import { VarS } from '../var/var';
import { StorageS } from '../storage/storage';
import { IUTMs, TUTMs, UTMKeys } from '../../models/events.model';

@Injectable({
  providedIn: 'root'
})
export class UtilS {

  readonly storage = inject(StorageS);
  readonly vars = inject(VarS);

  constructor() {
    this.setDeviceType();
    this.setUtm();
  }

  setDeviceType() {
    if (!this.vars.isBrowser) return;
    const userAgent = navigator.userAgent || navigator.vendor;
    this.vars.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    this.vars.deviceType = this.vars.isMobile ? 'mobile' : 'desktop';
    const qParams = this.vars.actRoute.snapshot.queryParams;
    if (qParams?.['platform']) {
      this.storage.addSessionData('platform', qParams['platform']);
    }
    const sessionPlatform = this.storage.getFromSession('platform');
    const cookiePlatform = this.storage.getCookie('platform');
    this.vars.deviceType = sessionPlatform || cookiePlatform || this.vars.deviceType;
  }

  setUtm(utms?: IUTMs) {
    const urlParams = this.vars.actRoute.snapshot.queryParams;
    const urlUtm = Object.keys(urlParams).filter(key => key.toLowerCase().startsWith('utm_')).reduce((acc: any, key) => { acc[key] = urlParams[key]; return acc; }, {} as Record<string, string>);
    const sessionUtm = this.storage.getFromSession('_utm');
    const cookieUtm = this.storage.getCookie('_utm');
    utms = utms || Object.entries(urlUtm).length ? urlUtm : (sessionUtm || cookieUtm || null);
    if (utms) {
      this.vars.utms = {};
      Object.entries(utms).forEach(([key, value]) => {
        if (UTMKeys.includes(key as TUTMs) && value) {
          this.vars.utms = { ...this.vars.utms, [key]: value };
        }
      });
      this.storage.checkFromSession('_utm', this.vars.utms);
    }
  }

  urlToParamObj(url: string): Record<string, string> {
    if (!url.includes('?')) {
      return {};
    }
    if (!url.includes('http')) {
      url = `a:b.c/${url}`;
    }
    const paramObj: Record<string, string> = {};
    try {
      const queryString = new URL(url).searchParams;
      queryString.forEach((value, key) => {
        paramObj[key] = value;
      });
    } catch (e) { }
    return paramObj;
  }

  getCurrentUrl(withParams: boolean = false) {
    const url = this.vars.isBrowser ? this.vars.document.URL : (this.vars.hostData.fullUrl + this.vars.router.url);
    return withParams ? url : url.split('?')[0];
  }

  capitalizeFirstLetter(name: string): string {
    return name.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  getAuthToken() {
    return this.vars.isBrowser ? this.storage.getCookie('_auth') || '' : '';
  }

  sanitizeObject(obj: Record<string, any>) {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null && value !== '' && value !== 'undefined' && value !== 'null') {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
}
