
export type IPageNames = 'home' | 'stories' | 'thank_you' | 'page_not_found' | 'profile' | 'donations' | 'payment_redirect_page' | '';
export type IPageOrigins = 'h' | 's' | 'ty' | '404' | 'pf' | 'dn' | 'prp' | '';

export const PAGE_ORIGIN_MAP: Record<IPageOrigins, IPageNames> = {
  h: 'home',
  s: 'stories',
  ty: 'thank_you',
  '404': 'page_not_found',
  pf: 'profile',
  dn: 'donations',
  prp: 'payment_redirect_page',
  '': ''
};

export interface ILayoutConfig {
  headerTopSticky?: boolean;
  logoNavigate?: boolean;
  showCurrency?: boolean;
  showDownloadApp?: boolean;
  showFooter?: boolean;
  showFooterSEO?: boolean;
  showHeader?: boolean;
  showHeaderV2?: boolean;
  showLanguage?: boolean;
  showMenus?: boolean;
  showProfile?: boolean;
  showSearch?: boolean;
  showSecure?: boolean;
  showMiniFooter?: boolean;
}

export const DefaultLayoutConfig: ILayoutConfig = {
  headerTopSticky: false,
  logoNavigate: true,
  showCurrency: false,
  showDownloadApp: false,
  showFooter: true,
  showFooterSEO: false,
  showHeader: true,
  showHeaderV2: false,
  showLanguage: false,
  showMenus: false,
  showProfile: true,
  showSearch: false,
  showSecure: false,
  showMiniFooter: false
};

export const PageLayoutConfig: any = {
  'home': {
    ...DefaultLayoutConfig,
    showHeader: false,
    showHeaderV2: true
  },
  'stories': {
    ...DefaultLayoutConfig,
    showCurrency: true,
    showSecure: true,
    showFooter: false,
    showMiniFooter: true
  },
  'thank_you': {
    ...DefaultLayoutConfig
  },
  'page_not_found': {
    ...DefaultLayoutConfig
  },
  'profile': {
    ...DefaultLayoutConfig
  },
  'aboutus': {
    ...DefaultLayoutConfig,
    showSecure: true
  },
  'guarantee': {
    ...DefaultLayoutConfig,
    showSecure: true
  },
  'donations': {
    ...DefaultLayoutConfig
  },
  'payment_redirect_page': {
    ...DefaultLayoutConfig,
    showHeader: false,
    showFooter: false
  }
};