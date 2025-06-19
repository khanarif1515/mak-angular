export const PAGE_ORIGIN_MAP = {
  '404': 'page_not_found',
  abs: 'aboutus',
  h: 'home',
  prf: 'profile',
  s: 'story',
  veh_br: 'vehicle_brand',
  veh: 'vehicle',
  '': ''
} as const;

export type TPageOrigins = keyof typeof PAGE_ORIGIN_MAP;
export type TPageNames = typeof PAGE_ORIGIN_MAP[TPageOrigins];


export interface ILayoutConfig {
  headerTopSticky?: boolean;
  logoNavigate?: boolean;
  showCurrency?: boolean;
  showFooter?: boolean;
  showFooterSEO?: boolean;
  showHeader?: boolean;
  showLanguage?: boolean;
  showMenus?: boolean;
  showProfile?: boolean;
}

export const DefaultLayoutConfig: ILayoutConfig = {
  headerTopSticky: false,
  logoNavigate: true,
  showCurrency: false,
  showFooter: true,
  showFooterSEO: false,
  showHeader: true,
  showLanguage: false,
  showMenus: true,
  showProfile: true
};

const layoutOverrides: Partial<Record<TPageNames, Partial<ILayoutConfig>>> = {
  vehicle: { showHeader: false, showFooter: false }
};

export const LayoutConfig = Object.keys(PAGE_ORIGIN_MAP).reduce((acc, originKey) => {
  const page = PAGE_ORIGIN_MAP[originKey as TPageOrigins];
  acc[page] = { ...DefaultLayoutConfig, ...layoutOverrides[page] };
  return acc;
}, {} as Record<TPageNames, ILayoutConfig>);
