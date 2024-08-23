export interface ILayoutConfig {
  headerTopSticky?: boolean;
  logoNavigate?: boolean;
  showCurrency?: boolean;
  showDownloadApp?: boolean;
  showFooter?: boolean;
  showFooterSEO?: boolean;
  showHeader?: boolean;
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
  showLanguage: false,
  showMenus: false,
  showProfile: false,
  showSearch: false,
};

export const PageLayoutConfig: any = {
  'home': {
    ...DefaultLayoutConfig,
  },
  'stories': {
    ...DefaultLayoutConfig,
    showFooter: true,
    showHeader: true,
  },
  'thank_you': {
    ...DefaultLayoutConfig,
  },
  'page_not_found': {
    ...DefaultLayoutConfig,
    showFooter: true,
    showHeader: true,
  }
};