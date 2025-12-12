import { inject, Injectable } from '@angular/core';
import { VariablesService } from '../variables/variables.service';
import { StorageService } from '../storage/storage.service';
import { IUTMs, TUTMs, UTMKeys } from '../../models/event.model';
import { ALL_DOMAINS } from '../../models/domain';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  readonly vars = inject(VariablesService);
  readonly storage = inject(StorageService);

  constructor() {
    this.setDeviceType();
    this.setUtm();
  }

  getQueryParams() {
    if (!this.vars.isBrowser) return {};
    const qParams: Record<string, string> = {};
    // const search = window.location.search.split('#')[0];
    const search = window.location.search;
    new URLSearchParams(search).forEach((value, key) => {
      qParams[key] = value;
    });
    return qParams;
  }

  setDeviceType() {
    if (!this.vars.isBrowser) return;
    const userAgent = navigator.userAgent;
    this.vars.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    this.vars.deviceType = this.vars.isMobile ? 'mobile' : 'desktop';
    const qParams = this.getQueryParams();
    if (qParams?.['platform']) {
      this.storage.addSessionData('platform', qParams['platform']);
    }
    const sessionPlatform = this.storage.getFromSession('platform');
    const cookiePlatform = this.storage.getCookie('platform');
    this.vars.deviceType = (typeof sessionPlatform === 'string' && sessionPlatform) || (typeof cookiePlatform === 'string' && cookiePlatform) || this.vars.deviceType;
  }

  setUtm(utms?: IUTMs) {
    const qParams = this.getQueryParams();
    const urlUtm = Object.keys(qParams).filter(key => key.toLowerCase().startsWith('utm_')).reduce<Record<string, string>>((acc: any, key) => { acc[key] = qParams[key]; return acc; }, {});
    const sessionUtm = this.storage.getFromSession('_utm');
    const cookieUtm = this.storage.getCookie('_utm');
    const finalUtms = utms || Object.entries(urlUtm).length ? urlUtm : (sessionUtm || cookieUtm || null);
    if (!finalUtms) return;
    this.vars.utms = {};
    for (const [key, value] of Object.entries(finalUtms)) {
      if (UTMKeys.includes(key as TUTMs) && value) {
        this.vars.utms = { ...this.vars.utms, [key]: value };
      }
    }
    this.storage.checkFromSession('_utm', this.vars.utms);
  }

  urlToParamObj(url: string): Record<string, string> {
    const paramObj: Record<string, string> = {};
    const qIndex = url.indexOf('?');
    if (qIndex === -1) return paramObj;
    const queryString = url.slice(qIndex + 1);
    const params = new URLSearchParams(queryString);
    params.forEach((value, key) => {
      paramObj[key] = value;
    });
    return paramObj;
  }

  setDomainDetails(url: string) {
    let domain = 'default';
    if (Object.keys(ALL_DOMAINS).includes(url)) {
      domain = url;
    }
    this.vars.hostData = ALL_DOMAINS[domain];
    if (this.vars.isBrowser) {
      this.vars.hostData = {
        ...this.vars.hostData,
        url: window.location.host,
        fullUrl: window.location.origin
      }
    }
  }

  setBrandLogo(logo?: { light?: string, dark?: string }) {
    this.vars.hostData.primaryLogo = logo?.dark || this.vars.hostData.primaryLogo;
    this.vars.hostData.secondaryLogo = logo?.light || this.vars.hostData.secondaryLogo;
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

  hexToRgb(hex: string): any {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  listenToGlabalJsVar() {
    if (!this.vars.isBrowser) return;
    const state: Record<string, any> = {};
    (window as any).globalVarSetter = new Proxy(state, {
      set: (target, key: string, value) => {
        target[key as string] = value;
        // Signal accepts 1 argument (the new value)
        this.vars.globalVar.set({ ...target });
        return true;
      }
    });
  }


}
