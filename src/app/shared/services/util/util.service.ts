import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../storage/storage.service';
import { VariablesService } from '../variables/variables.service';
import { Domains } from '../../model/domains';
import { ICurrency } from '../../model/currency.model';
import { IUser } from '../../model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DateService } from '../date/date.service';
import { IFundraiser } from '../../model/fundraiser.model';
import { ScriptLoaderService } from '../script-loader/script-loader.service';

declare const lightGallery: any;

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    @Inject(DOCUMENT) public document: any,
    @Inject(PLATFORM_ID) public platformId: Object,
    private dateService: DateService,
    public dialog: MatDialog,
    public sheet: MatBottomSheet,
    public router: Router,
    public snackBar: MatSnackBar,
    public storage: StorageService,
    public titleService: Title,
    private scriptLoader: ScriptLoaderService,
    public vars: VariablesService,
  ) {
    this.vars.isBrowser = isPlatformBrowser(this.platformId);
    this.isMobile();
    if (this.vars.isBrowser) {
      this.setDomainDetails(location.host);
    } else {
      this.setDomainDetails('');
    }
  }

  setUtm() {
    if (this.vars.isBrowser) {
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
    if (this.vars.isBrowser) {
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

  setUser(data: any) {
    if (data?.token) {
      this.vars.authToken = data?.token;
    }
    if (this.vars.isVariableLogin) {
      this.vars.varLoginData.user = data;
    } else {
      this.storage.check('user', data);
    }
    return true;
  }

  getUser() {
    if (this.vars.isVariableLogin) {
      return this.vars.varLoginData.user;
    } else {
      const user = this.storage.get('user');
      if (user?.token) {
        this.vars.authToken = user.token;
      }
      return user;
    }
  }

  getUserData(): IUser {
    if (this.vars.isVariableLogin) {
      return this.vars.varLoginData.userdata;
    } else {
      return this.storage.get('userdata');
    }
  }

  setUserData(userdata: IUser) {
    if (userdata?.email?.match(this.vars?.dummyEmailExtn)) {
      userdata.isDummyEmail = true;
      this.vars.isDummyEmail = true;
    } else {
      this.vars.isDummyEmail = false;
    }
    if (this.vars.isVariableLogin) {
      this.vars.varLoginData.userdata = userdata;
    } else {
      this.storage.check('userdata', userdata);
    }
    return true;
  }

  isMobile() {
    if (this.vars.isBrowser) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        this.vars.isMobile = true;
      }
    }
    return this.vars.isMobile;
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
    const title = this.capitalizeFirstLetter(name);
    this.titleService.setTitle(title);
  }

  capitalizeFirstLetter(name: string | undefined): string {
    if (!name) { return name || '' };
    return name.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  toTitleCase(data: any) {
    if (typeof data === 'string') {
      return data.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
    } else if (typeof data === 'object') {
      let new_str = '';
      for (const key in data) {
        new_str = new_str + (new_str ? '-' : '') + data[key].toLowerCase().replace(/\b\w/g, (s: any) => s.toUpperCase());
      }
      return new_str;
    }
    return data;
  }

  truncateString(str: string, afterChar: number): string {
    return str?.substring(0, afterChar).concat('...') || '';
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
    if (this.vars.isBrowser) {
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

  getUserType(campainerId: number | undefined, enityId: number | undefined, userId: number | undefined) {
    switch (true) {
      case campainerId === userId:
        return 'Campaigner';
      case enityId === userId:
        return 'NGO';
      default:
        return 'Visitor';
    }
  }

  detectBrowser(): String {
    if (this.vars.isBrowser) {
      const userAgent = window.navigator.userAgent;
      const browser = userAgent.match('Chrome|Firefox|Safari|NetScape|Opera|MSIE');
      return browser ? browser[0] : '';
    } else {
      return '';
    }
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
      apiUrl: domainData.apiUrl,
      logoDarkBg: domainData.logoDarkBg,
      logoLightBg: domainData.logoLightBg,
      name: domainData.name,
      url: domainData.url
    }

    if (this.vars.isBrowser) {
      this.vars.domain_details = {
        ...this.vars.domain_details,
        // name: window.location.hostname,
        url: window.location.host,
        fullUrl: window.location.origin
      }
    }

    if (!this.vars.isBrowser) {
      console.log('setDomainDetails url = ', url);
      console.log('setDomainDetails domain = ', domain);
    }
  }

  removeEmptyFromObject(obj: any) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== '' && value !== null && value !== undefined && value !== 'undefined')
    );
  }

  objectToUrlString(obj: any): string {
    let qParam = '';
    if (typeof obj === 'object') {
      qParam = Object.entries(obj)
        .filter(([_, value]) => value !== '' && value !== null && value !== undefined && value !== 'undefined')
        .map(([key, val]) => `${key}=${val}`).join('&');
    }
    return qParam;
  }

  scrollIntoViewSmoothlyByClass(className: string, elPos: number = 0, offset: number = 20, behavior: ScrollBehavior = 'smooth') {
    if (this.vars.isBrowser) {
      const elements = document.getElementsByClassName(className);
      if (elements.length > elPos) {
        const targetElement = elements[elPos] as HTMLElement;
        if (!targetElement.id) {
          targetElement.id = 'scroll-id';
        }
        const targetOffsetTop = targetElement?.offsetTop ?? 0;
        window.scrollTo({
          top: targetOffsetTop - offset,
          behavior: behavior
        });
      } else {
        console.error(`Element at position ${elPos} not found in class ${className}.`);
      }
    }
  }

  handleFundraiserData(fundraiser: any) {
    const fundBasicInfo: any[] = fundraiser?.basicinfo || [];
    const fundBeneficiary: any = fundraiser?.beneficiary;
    if (!fundraiser?.basicInfo) {
      fundraiser.basicInfo = {};
    }
    if (fundBasicInfo?.length) {
      fundBasicInfo.forEach(item => {
        fundraiser['basicInfo'][item.info_type] = item.info_1 || '';
      });
    }
    if (!fundBeneficiary?.full_name && fundraiser?.basicInfo?.beneficiary_name) {
      fundraiser.beneficiary = {
        ...fundraiser.beneficiary,
        full_name: fundraiser.basicInfo.beneficiary_name,
        relation: fundraiser.basicInfo.beneficiary_relation
      }
    }
    fundraiser = this.getFundraiserStatus(fundraiser);
    return fundraiser;
  }

  getFundraiserStatus(fundraiser: IFundraiser) {
    fundraiser.isEnded = this.checkFundraiserEnded(fundraiser.status_flag, fundraiser.end_date);
    if (fundraiser.isEnded) {
      if (fundraiser.raised) {
        fundraiser.isSuccessfullyFunded = this.checkIfSuccessfullyFunded(
          fundraiser?.amount_requested!, fundraiser?.raised?.raised!
        );
      }
    }
    return fundraiser;
  }

  checkIfSuccessfullyFunded(amount: number, raised: number) {
    if (amount && raised) {
      return raised / amount > 0.6 ? true : false;
    } else {
      return false;
    }
  }

  checkFundraiserEnded(status: any, endDate: any): any {
    if (endDate) {
      const daysLeft = this.dateService.diffInDays(endDate);
      if (daysLeft < 0) {
        return true;
      }
    }
    switch (status) {
      // Fundraiser Active
      case 1:
        return false;
      // Fundraiser Expired
      case 4:
        return true;
      // Fundraiser Active
      case 5:
        return false;
    }
  }

  getMobileOperatingSystem(): string {
    if (this.vars.isBrowser) {
      const userAgent = navigator.userAgent || navigator.vendor;
      if (/windows phone/i.test(userAgent)) {
        return 'Windows Phone';
      }
      if (/android/i.test(userAgent)) {
        return 'Android';
      }
      if (/iPad|iPhone|iPod/.test(userAgent)) {
        return 'iOS';
      }
    }
    return 'unknown';
  }

  getCampaignTypeFromId(id?: number): string {
    switch (id) {
      case 20:
        return 'personal';
      case 48:
        return 'ngo';
      case 49:
        return 'creative';
      case 149:
        return 'ad';
    }
    return '';
  }

  arrayTostring(data: any, seperator?: string) {
    let str = '';
    if (Array.isArray(data)) {
      data.forEach((v, i) => { str = str + (str && i < data.length ? seperator || '' : '') + v });
    } else if (typeof data === 'string') {
      str = data;
    }
    return str;
  }

  openSnackBar(message: string, type: 'success' | 'error', config?: MatSnackBarConfig) {
    if (message?.match(`Unexpected token '<'`)) { return; }
    const snackBarClass = type === 'success' ? 'snackbar-success' : 'snackbar-error';
    const matConfig: MatSnackBarConfig = {
      verticalPosition: config && config.verticalPosition ? config.verticalPosition : 'top',
      horizontalPosition: config && config.horizontalPosition ? config.horizontalPosition : 'center',
      panelClass: [snackBarClass],
      duration: config && config.duration ? config.duration : 10000
    };
    this.snackBar.open(message, 'DISMISS', matConfig).afterOpened().subscribe(() => {
      if (typeof document !== 'undefined') {
        const el: any = document.getElementsByTagName('snack-bar-container').item(0);
        if (el) {
          el.parentElement.parentElement.style.zIndex = '1001';
        }
      }
    });
  }


  getInitialsOfName(name: string): any {
    if (name) {
      const data = name ? name.split(' ') : [];
      if (data.length > 1) {
        return data[0].charAt(0) + data[1].charAt(0);
      } else {
        return data[0].charAt(0).trim();
      }
    }
  }

  addCssToGlobal(link: string) {
    if (typeof document !== 'undefined') {
      const _el = document.createElement('link');
      _el.href = link;
      _el.rel = 'stylesheet';
      document.getElementsByTagName('head')[0].appendChild(_el);
    }
  }

  listenToGlabalJsVar() {
    if (this.vars.isBrowser) {
      try {
        (<any>window).globalVarSetter = new Proxy({}, {
          set: (target: any, key, value) => {
            target[key] = value;
            this.vars.globalVar.next(target);
            return true;
          }
        });
      } catch (e) { }
    }
  }

  getPercentage(required: number, raised: number, round = true): number {
    let perc: number = (raised / required) * 100;
    if (round) {
      perc = Math.round(perc);
    }
    return perc;
  }

  getPercent(required: number, percentage: number, round = true): number {
    let perc: number = (required * percentage) / 100;
    if (round) {
      perc = Math.round(perc);
    }
    return perc;
  }

  handleRaisedAmt(fundraiser?: IFundraiser, donated_amount?: number) {
    if (fundraiser?.raised?.raised && fundraiser?.amount_requested && donated_amount) {
      fundraiser.raised.beforeTickrBackers = fundraiser.raised.backers;
      fundraiser.raised.raisedPerc = this.getPercentage(fundraiser.amount_requested, fundraiser.raised.raised);
      fundraiser.raised.initRaised = this.getPercent(fundraiser.amount_requested || 0, 1);
      if (donated_amount) {
        fundraiser.raised.increaseRaiseBy = fundraiser.raised.raised + (donated_amount * 2);
        fundraiser.raised.increaseRaiseByPerc = this.getPercentage(fundraiser.amount_requested, fundraiser.raised.increaseRaiseBy);
        fundraiser.raised.increaseRaiseByPerc = (fundraiser.raised.increaseRaiseByPerc >= 100) ? 100 : fundraiser.raised.increaseRaiseByPerc;
      }
    }
    return fundraiser;
  }

  openInNewTab(url: string) {
    window.open(url, '_blank')?.focus();
  }

  testImage(url: any, timeout: number = 5000) {
    return new Promise((resolve, reject) => {
      let timedOut = false;
      let timer: any;
      let img = new Image();
      img.onerror = img.onabort = function () {
        if (!timedOut) {
          clearTimeout(timer);
          reject({ url, status: 'error' });
        }
      };
      img.onload = function () {
        if (!timedOut) {
          clearTimeout(timer);
          resolve({ url, status: 'success' });
        }
      };
      img.src = url;
      timer = setTimeout(function () {
        timedOut = true;
        img.src = "//!!!!/test.jpg";
        resolve({ url, status: 'timeout' });
      }, timeout);
    })
  }

  async initGallery(elementId: any, config?: any) {
    if (this.vars.isBrowser) {
      if (typeof lightGallery !== 'undefined') {
        lightGallery(this.document.getElementById(elementId), config);
      } else {
        this.addCssToGlobal('https://cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/css/lightgallery.min.css');
        await this.scriptLoader.load('lightgallery');
        await this.scriptLoader.load('lg-zoom');
        await this.scriptLoader.load('lg-hash');
        await this.scriptLoader.load('lg-thumbnail');
        this.initGallery(elementId, config);
      }
    }
  }
}
