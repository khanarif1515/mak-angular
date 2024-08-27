export const IPageNames: 'home' | 'honda' | 'page_not_found' | 'stories' | 'thank_you' | '' = '';

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
}

export const DefaultLayoutConfig: ILayoutConfig = {
  headerTopSticky: false,
  logoNavigate: false,
  showCurrency: false,
  showDownloadApp: false,
  showFooter: false,
  showFooterSEO: false,
  showHeader: false,
  showHeaderV2: false,
  showLanguage: false,
  showMenus: false,
  showProfile: false,
  showSearch: false,
};

export const PageLayoutConfig: any = {
  'home': {
    ...DefaultLayoutConfig,
    showHeaderV2: true,
    showFooter: true
  },
  'stories': {
    ...DefaultLayoutConfig,
    showHeader: true,
    showFooter: true
  },
  'thank_you': {
    ...DefaultLayoutConfig,
    showHeader: true,
    showFooter: true
  },
  'page_not_found': {
    ...DefaultLayoutConfig,
    showHeader: true,
    showFooter: true
  }
};