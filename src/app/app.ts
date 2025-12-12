import { Component, inject } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { VariablesService } from './shared/services/variables/variables.service';
import { UtilsService } from './shared/services/utils/utils.service';
import { ApiService } from './shared/services/api/api.service';
import { SeoService } from './shared/services/seo/seo.service';
import { LayoutConfig } from './shared/models/layout.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly util = inject(UtilsService);
  private readonly vars = inject(VariablesService);

  qParams: any;

  ngOnInit() {
    this.qParams = this.util.getQueryParams();
    this.setSomeCookies();
    this.routeChangeListener();
    const webPageSchema = {
      '@context': 'http://schema.org',
      '@id': `${this.vars.hostData.url}`,
      '@type': 'WebPage',
      'url': `${this.vars.hostData.url}`,
      'name': `${this.vars.hostData.name}`
    };
    this.seo.setSchemaObject(webPageSchema);
    // this.util.listenToGlabalJsVar();
    if (this.vars.isBrowser) {
      // this.getClientIP();
      // this.setUser();
    }
  }

  setSomeCookies() {
    if (this.vars.isBrowser) {
      if (!this.qParams?.hasOwnProperty('utm_source')) {
        return;
      }
      this.qParams.created_date = new Date().toISOString();
      const utmSource = this.qParams?.utm_source?.toLowerCase();

      if (utmSource?.match('_calling')) {
        this.util.storage.setCookie('_telecaling', `${JSON.stringify(this.qParams)}`, 7);

      } else if (utmSource?.match('_ct|_clevertap')) {
        this.util.storage.setCookie('_clevertap', `${JSON.stringify(this.qParams)}`, 7);

      } else if (utmSource?.match('external_')) {
        this.util.storage.setCookie('_ad', `${JSON.stringify(this.qParams)}`, 7);
      }
    }
  }

  routeChangeListener() {
    this.vars.router.events.subscribe(event => {
      // if (event instanceof RouteConfigLoadStart || event instanceof RouteConfigLoadEnd) {
      //   this.loadingRouteConfig = event instanceof RouteConfigLoadStart;
      //   console.log(this.loadingRouteConfig);
      // }
      if (event instanceof NavigationEnd) {
        if (this.vars.isBrowser) {
          if (this.vars.currentUrl) {
            this.vars.previousUrl = `${location.origin}${this.vars.currentUrl}`;
          }
          this.vars.currentUrl = event.urlAfterRedirects;
        }

        const route = this.getPrimaryRoute(this.vars.actRoute);
        const data = route.snapshot.data;

        const currentPath = this.vars.router.url.split('?')[0];
        const previousPath = this.vars.previousUrl.split('?')[0];

        if (currentPath !== previousPath) {
          this.vars.origin = data?.['or'] || '';
          this.vars.pageName = data?.['pageName'] || '';
          this.vars.layoutConfig = LayoutConfig[this.vars.pageName];
          this.seo.setCanonical();
          this.seo.setPageTitle();
          this.seo.setDefaultMeta();
          this.util.setUtm();
          // this.gtmOnLoad(data);
        }
      }
    });
  }

  getPrimaryRoute(actRoute = this.vars.actRoute) {
    while (actRoute.firstChild) {
      actRoute = actRoute.firstChild;
    }
    return actRoute.outlet === 'primary' ? actRoute : actRoute.parent!;
  }

  // gtmOnLoad(event: any) {
  //   const user: IUser = this.util.getUserData();
  //   const currency = this.util.storage.getFromSession('currency');
  //   const gtmPush = {
  //     event: 'virtual_pageview',
  //     page_version: 'A',
  //     login_status: user ? 'logged in' : 'not logged in', // Populate either LOGGED IN or NOT LOGGED IN
  //     user_type: user?.entity_type || 'visitor',
  //     currency: currency, // Currency used
  //     // session_id: '',
  //     user_id: user ? user.id : '',   // Identifies unique users across multiple devices
  //     page_category: event.category,  // ex: home, crowdfunding, fundraiser etc
  //     page_name: event.page_name,  // name of the page
  //     sip: event.sip || false  // name of the page
  //   };
  //   this.vars.gtmPageData = gtmPush;
  //   this.events.gtmPush(gtmPush);
  // }

  // getClientIP() {
  //   const ip = this.util.storage.getFromSession('iplocation');
  //   if (ip) {
  //     this.setClientIP(ip);
  //   } else {
  //     this.api.get(API_URLS.GET_IP).subscribe({
  //       next: (res: any) => {
  //         this.setClientIP(res?.data);
  //       },
  //       error: (err: any) => {
  //         this.setClientIP();
  //       }
  //     });
  //   }
  // }

  // setClientIP(ip: ICLientData = DefaultIPLocation) {
  //   const criteoPartnerIDs: any = {
  //     'IN': 56509,
  //     'AE': 69550
  //   };
  //   this.vars.clientLocationData$.next(ip);
  //   const criteoId = criteoPartnerIDs[ip.country_name] || 66025;
  //   this.events.gtmPush({ 'CriteoPartnerID': criteoId });
  //   this.util.storage.checkFromSession('iplocation', ip);
  //   this.setCurrency(ip);
  // }

  // setCurrency(ip: ICLientData) {
  //   const currencyFromUrl = this.actRoute.snapshot.queryParams['selected_currency'];
  //   const currencyFromCode = this.util.getCurrencyFromCode(ip.country_code);
  //   const currencyFromSession = this.util.storage.getFromSession('currency');
  //   if (currencyFromUrl) {
  //     this.util.setCurrency(currencyFromUrl);
  //   } else if (currencyFromSession) {
  //     this.util.setCurrency(currencyFromSession);
  //   } else if (currencyFromCode) {
  //     this.util.setCurrency(currencyFromCode?.currency || '');
  //   }
  // }

  // setUser() {
  //   try {
  //     const user = this.util.getUser();
  //     if (user && !this.vars.isVariableLogin) {
  //       const domain = environment.name === 'local' ? 'localhost' : '.equalall.org';
  //       this.util.storage.setCookie('is_logged_in', 'true', 365, domain);
  //     }
  //     const userData = this.util.getUserData();
  //     const userType = this.util.setLogginStatus(user, userData);
  //     if (userData) {
  //       this.vars.userData$.next(userData);
  //     }
  //   } catch (error) {
  //     // console.log(error);
  //   }
  // }

  // getDomain() {
  //   const url = API_URLS.GET_DOMAIN;
  //   this.api.get(url).subscribe({
  //     next: (res: any) => {
  //       this.setSeo({ domainName: res?.data?.name || '', logo: res?.data?.logo, favicon: res?.data?.favicon?.path });
  //       if (res?.data?.theme?.theme_color && this.vars.isBrowser) {
  //         document.documentElement.style.setProperty('--primary-color', res.data.theme.theme_color);
  //         const code = this.util.hexToRgb(res.data.theme.theme_color);
  //         document.documentElement.style.setProperty('--primary-color-rgb', `rgb(${code.r}, ${code.g}, ${code.b})`);
  //       }
  //       this.vars.isDomainLoaded$.next(true);
  //     },
  //     error: (err: any) => {
  //       // console.log(err);
  //     }
  //   });
  // }

  setSeo(data?: { domainName?: string, logo?: { light?: string, dark?: string }, favicon?: string }) {
    if (data?.domainName) {
      this.vars.hostData.name = data?.domainName || this.vars.hostData.name || '';
    }
    this.seo.setPageTitle(this.vars.hostData.name || '');
    this.seo.setFavicon(data?.favicon || 'assets/favicon.ico');
    this.util.setBrandLogo(data?.logo);
  }
}
