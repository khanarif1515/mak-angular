import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ILayoutConfig } from '../../model/layout-config.model';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { IHost } from '../../model/host.model';
import { ICLientData } from '../../model/client.model';
import { ICurrency } from '../../model/currency.model';
import { Currency, EuropeanCountries, GulfCountries } from '../../model/currency-list';
import { IUser } from '../../model/user.model';
import { Domains } from '../../model/domains';
import { BehaviorSubject } from 'rxjs';
import { IFundraiser } from '../../model/fundraiser.model';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  clientLocationData = new BehaviorSubject<ICLientData | null>(null);
  currencies: ICurrency[] = Currency;
  currency = '';
  currency$ = new BehaviorSubject('');
  deviceType = '';
  domainFavicon = Domains['default'].favicon;
  domainLogoDarkBack = Domains['default'].logoDarkBack;
  domainLogoLightBack = Domains['default'].logoLightBack;
  domainName = Domains['default'].name;
  domain_details?: IHost;
  europeanCountries = EuropeanCountries;
  fundraiser?: IFundraiser;
  gtmPageData: any;
  gulfCountries = GulfCountries;
  isBrowser = false;
  isDomainLoaded$ = new BehaviorSubject(false);
  isDummyEmail = false;
  isPermanentLoggedIn = false;
  isPermanentLoggedIn$ = new BehaviorSubject(false);
  isTempLoggedIn = false;
  isTempLoggedIn$ = new BehaviorSubject(false);
  isMobile = false;
  isStoryDataLoading = false;
  isToken = false;
  isVariableLogin = false;
  metaDataOfPage: any;
  pageName = '';
  paymentCurrency = '';
  poweredBy = 'Ketto';
  previousPageUrl = '';
  userData$ = new BehaviorSubject<IUser | undefined>(undefined);
  utm_url_obj: any;
  utm_url_string = '';
  varLoginData: { user: any, userdata: any } = { user: null, userdata: null };
  pageLayoutConfig?: ILayoutConfig;

  constructor(
    public router: Router,
    @Inject(DOCUMENT) public document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.domain_details = {
        domain_name: window.location.hostname,
        domain_url: window.location.origin,
        full_url: window.location.href
      };
    }
  }


}
