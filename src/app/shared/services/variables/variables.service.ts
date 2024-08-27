import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ILayoutConfig, IPageNames } from '../../model/layout-config.model';
import { IHost } from '../../model/host.model';
import { ICLientData } from '../../model/client.model';
import { ICurrency } from '../../model/currency.model';
import { Currency, EuropeanCountries, GulfCountries } from '../../model/currency-list';
import { IUser } from '../../model/user.model';
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
  domain_details!: IHost;
  europeanCountries = EuropeanCountries;
  fundraiser?: IFundraiser;
  gtmPageData: any;
  gulfCountries = GulfCountries;
  isBrowser?: boolean;
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
  pageName: typeof IPageNames = '';
  paymentCurrency = '';
  poweredBy = 'Ketto';
  previousPageUrl = '';
  userData$ = new BehaviorSubject<IUser | undefined>(undefined);
  utm_url_obj: any;
  utm_url_string = '';
  varLoginData: { user: any, userdata: any } = { user: null, userdata: null };
  pageLayoutConfig?: ILayoutConfig;

  constructor(
    @Inject(DOCUMENT) public document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        this.isMobile = true;
      }
    }
  }


}
