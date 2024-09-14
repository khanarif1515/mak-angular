import { Injectable } from '@angular/core';
import { ILayoutConfig, IPageNames, IPageOrigins } from '../../model/layout-config.model';
import { IHost } from '../../model/host.model';
import { ICLientData } from '../../model/client.model';
import { ICurrency } from '../../model/currency.model';
import { Currency, EuropeanCountries, GulfCountries } from '../../model/currency-list';
import { IUser } from '../../model/user.model';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { IFundraiser } from '../../model/fundraiser.model';
import { ITypParams } from '../../model/payment.model';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  clientLocationData$ = new BehaviorSubject<ICLientData | null>(null);
  currencies: ICurrency[] = Currency;
  supportedCurrency: ICurrency[] = Currency;
  currency = '';
  currency$ = new BehaviorSubject('');
  defaultImg = '/assets/images/default/default-story.png';
  defaultBlurImg = '/assets/images/defaultBlurImg.png';
  deviceType = '';
  domain_details!: IHost;
  europeanCountries = EuropeanCountries;
  fundraiser?: IFundraiser;
  globalVar = new ReplaySubject<any>(1);
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
  authToken = '';
  isVariableLogin = false;
  metaDataOfPage: any;
  numberChange$ = new Subject<any>();
  pageName: IPageNames = '';
  origin: IPageOrigins = '';
  paymentCurrency = '';
  poweredBy = 'EqualAll';
  previousPageUrl = '';
  userData$ = new BehaviorSubject<IUser | undefined>(undefined);
  utm_url_obj: any;
  utm_url_string = '';
  varLoginData: { user: any, userdata: any } = { user: null, userdata: null };
  pageLayoutConfig?: ILayoutConfig;
  stringOnlyRegex = /^[a-zA-Z\s]+$/;
  numberOnlyRegex = /^\d+(\.\d+)?$/;
  namePatternRegex = /^[a-z ,.'-]+$/i;
  emailPatternRegex = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
  pswPatternRegex = /^(?=.*[a-z])+(?=.*[A-Z])+(?=.*\d).{8,}$/;
  userPhoneExt = '';
  userPhoneNumber = '';
  loginMethod = '';
  dummyEmailExtn = '@dummyketto.org';
  donateMultiPatient: boolean = false;
  recommendedVpa = '';
  sidebarDrawerState = new BehaviorSubject(false);

  selectTipPercentage?: number;
  eventInfos = {
    contributeInitiate: { info_1: 'position', info_2: 11, info_3: '' },
    contributeCart: { info_1: '', info_2: '', info_3: '' },
    orderCreated: { info_1: '', info_2: '', info_3: '' },
  }
  tyParams?: ITypParams;
  showSkeletonFor = {
    slab: false
  };

  stripeUsToken: any;
  maxDonationAmount = 50000000;

  constructor() { }


}
