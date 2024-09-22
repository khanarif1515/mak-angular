
export type IPageOrigins = 'h' | 's' | '404' | 'si' | 'su' | 'haz' | '';
export type IPageNames = 'home' | 'stories' | 'page_not_found' | 'signin' | 'signup' | 'honda_amaze' | 'blank';

export const PAGE_ORIGIN_MAP: Record<IPageOrigins, IPageNames> = {
  h: 'home',
  s: 'stories',
  404: 'page_not_found',
  si: 'signin',
  su: 'signup',
  haz: 'honda_amaze',
  '': 'blank'
};

export interface ILayoutConfig {
  headerTopSticky?: boolean;
  logoNavigate?: boolean;
  showCurrency?: boolean;
  showFooter?: boolean;
  showFooterSEO?: boolean;
  showHeader?: boolean;
  showLanguage?: boolean;
  showMenus?: boolean;
  showMiniFooter?: boolean;
  showProfile?: boolean;
  showSearch?: boolean;
  showSecure?: boolean;
}

export const DefaultLayoutConfig: ILayoutConfig = {
  headerTopSticky: false,
  logoNavigate: true,
  showCurrency: false,
  showFooter: true,
  showFooterSEO: false,
  showHeader: true,
  showLanguage: false,
  showMenus: false,
  showMiniFooter: false,
  showProfile: true,
  showSearch: false,
  showSecure: false
};

export const PageLayoutConfig: Record<IPageOrigins, ILayoutConfig> = {
  'h': {
    ...DefaultLayoutConfig
  },
  's': {
    ...DefaultLayoutConfig,
    showCurrency: true,
    showSecure: true,
    showFooter: false,
    showMiniFooter: true
  },
  404: {
    ...DefaultLayoutConfig
  },
  'si': {
    ...DefaultLayoutConfig
  },
  'su': {
    ...DefaultLayoutConfig
  },
  'haz': {
    ...DefaultLayoutConfig,
    showHeader: false,
    showFooter: false
  },
  '': {
    ...DefaultLayoutConfig
  }
};