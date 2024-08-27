import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../storage/storage.service';
import { VariablesService } from '../variables/variables.service';
import { Domains } from '../../model/domains';
import { ICurrency } from '../../model/currency.model';
import { IUser } from '../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  isBrowser?: boolean;

  constructor(
    public router: Router,
    public storage: StorageService,
    public titleService: Title,
    public vars: VariablesService,
    @Inject(DOCUMENT) public document: any,
    @Inject(PLATFORM_ID) public platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isMobile();
    if (this.isBrowser) {
      console.log(location.host);
      this.setDomainDetails(location.host);
    } else {
      this.setDomainDetails('');
    }
  }

  setUtm() {
    if (this.isBrowser) {
      this.vars.utm_url_string = this.getUTMOnly('url_string');
      this.vars.utm_url_obj = this.getUTMOnly();
    }
  }

  getUTMOnly(returnType?: 'url_string' | ''): any {
    const parmas = this.getUTMs();
    const utmParams = Object.keys(parmas).filter(key => key.toString().toLocaleLowerCase().match('utm')).reduce((cur, key) => Object.assign(cur, { [key]: parmas[key] }), {});
    if (returnType === 'url_string') {
      return Object.keys(utmParams).length ? new URLSearchParams(utmParams).toString() : '';
    } else {
      return utmParams;
    }
  }

  getUTMs() {
    const utmsInUrl = this.getUrlParams();
    if (utmsInUrl && utmsInUrl.hasOwnProperty('utm_source')) {
      return utmsInUrl;
    }
    const utmsInCookie = this.storage.getDecodedCookies('k_utm');
    if (utmsInCookie && utmsInCookie.hasOwnProperty('utm_source')) {
      return utmsInCookie;
    }
    return {};
  }

  getUrlParams() {
    if (this.isBrowser) {
      const search = document.location.search.substring(1);
      return search.split('&').reduce(function (prev: any, curr) {
        if (curr) {
          const p = curr.split('=');
          prev[p[0]] = decodeURIComponent(p?.[1]) || '';
        }
        return prev;
      }, {});
    }
  }

  getUser() {
    if (this.vars.isVariableLogin) {
      return this.vars.varLoginData.user;
    } else {
      return this.storage.get('user');
    }
  }

  getUserData(): IUser {
    if (this.vars.isVariableLogin) {
      return this.vars.varLoginData.userdata;
    } else {
      return this.storage.get('userdata');
    }
  }

  isMobile() {
    if (this.isBrowser) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
      }
    }
    return false;
  }

  getCurrencyFromCode(code: string) {
    const currency = this.vars.currencies.find(item => item.code === code);
    if (currency) {
      return currency;
    }
    if (this.vars.europeanCountries.includes(code)) {
      return this.vars.currencies.find(item => item.code === 'EUR');
    } else if (this.vars.gulfCountries.includes(code)) {
      return this.vars.currencies.find(item => item.code === 'SAR');
    }
    return this.vars.currencies.find(item => item.code === 'US');
  }

  setCurrency(currency: string) {
    this.vars.currency = currency;
    this.vars.currency$.next(currency);
    this.storage.addSessionData('currency', currency);
  }

  setLogo(logo?: { light?: string, dark?: string }) {
    this.vars.domain_details.logoLightBg = logo?.dark || this.vars.domain_details.logoLightBg;
    this.vars.domain_details.logoDarkBg = logo?.light || this.vars.domain_details.logoDarkBg;
  }

  setFavicon(url: string) {
    if (url) {
      let link = this.document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = `${url}`;
      this.document.getElementsByTagName('head')[0].appendChild(link);
    }
  }

  setPageTitle(name: string) {
    const title = this.capitalizeFirstLatter(name);
    this.titleService.setTitle(title);
  }

  capitalizeFirstLatter(name: string) {
    if (!name) { return name };
    return name.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  hexToRgb(hex: string): any {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  scrollToTop(b: 'smooth' | 'auto' | 'instant' = 'smooth') {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: b });
    }
  }

  setLogginStatus(isTemp: boolean) {
    if (isTemp) {
      this.vars.isTempLoggedIn = true;
      this.vars.isTempLoggedIn$.next(true);
    } else {
      this.vars.isPermanentLoggedIn = true;
      this.vars.isPermanentLoggedIn$.next(true);
    }
  }

  getCurrencyIcon(currency: string): ICurrency | undefined {
    const data = this.vars.currencies.find(item => item.currency === currency);
    return data || undefined;
  }

  setDomainDetails(url: string) {
    let domain = 'default';
    if (Object.keys(Domains).includes(url)) {
      domain = url;
    }
    const domainData = Domains[domain];
    this.vars.domain_details = {
      favicon: domainData.favicon,
      fullUrl: domainData.fullUrl,
      logoDarkBg: domainData.logoDarkBg,
      logoLightBg: domainData.logoLightBg,
      name: domainData.name,
      url: domainData.url
    }
  }

  openSnackBar(message: string, type: 'success' | 'error') { }
}
