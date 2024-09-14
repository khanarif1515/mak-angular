import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap, pairwise } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_URLS } from 'src/environments/api-urls';
import { ApiService, EventsService, ScriptLoaderService, SeoService, UtilService, VariablesService } from './shared/services';
import { IUser } from './shared/model/user.model';
import { ICLientData } from './shared/model/client.model';
import { DefaultIPLocation } from './shared/model/default-ip';
import { DefaultLayoutConfig, PageLayoutConfig } from './shared/model/layout-config.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'MAK';
  qParams: any;
  loadingRouteConfig = true;

  constructor(
    private actRoute: ActivatedRoute,
    private api: ApiService,
    private events: EventsService,
    private router: Router,
    private scriptLoader: ScriptLoaderService,
    private seo: SeoService,
    private util: UtilService,
    private vars: VariablesService
  ) { }

  ngOnInit(): void {
    this.qParams = { ...this.actRoute.snapshot.queryParams };
    // this.getDomain();
    this.routeChangeListner();
    this.setSomeCookies();
    const webPageSchema = {
      '@context': 'http://schema.org',
      '@id': `${this.vars.domain_details?.url}`,
      '@type': 'WebPage',
      'url': `${this.vars.domain_details?.url}`,
      'name': `${this.vars.domain_details?.name}`
    };
    this.seo.schemaOrgObject(webPageSchema);
    if (this.vars.isBrowser) {
      this.setDeviceType();
      this.getClientIP();
      this.setUser();
    }
  }

  @HostListener('window:load', [])
  onWindowLoads() {
    if (this.vars.isBrowser) {
      // this.scriptLoader.loadScript('clevertap', '', true);
      // if (environment.name !== 'local') {
      //   this.scriptLoader.loadScript('gtm', '', true);
      // }
      // if (environment.production) {
      //   this.scriptLoader.loadScript('microsoft_clarity', '', true);
      // }
      this.vars.userData$.subscribe({
        next: res => {
          if(res?.id) {
            this.events.clarityEventsPush(res.id);
            if (res?.isDummyEmail) {
              this.vars.isDummyEmail = true;
            } else {
              this.vars.isDummyEmail = false;
            }
          }
        }
      });
    }
  }

  routeChangeListner() {
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loadingRouteConfig = false;
      }
    });

    if (this.vars.isBrowser) {
      this.router.events.pipe(filter((evt: any) => evt instanceof NavigationEnd), pairwise()).subscribe((events: [NavigationEnd, NavigationEnd]) => {
        this.vars.previousPageUrl = `${location.origin}${events[0].urlAfterRedirects}`;
      });
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.actRoute),
      map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
    ).subscribe((event) => {
      if (this.router.url.split('?')[0] !== this.vars.previousPageUrl.split('?')[0]) {
        this.vars.pageName = event['page_name'] || '';
        this.vars.pageLayoutConfig = PageLayoutConfig[this.vars.pageName] || DefaultLayoutConfig;
        this.seo.createCanonicalURL();
        this.util.setUtm();
        this.gtmOnLoad(event);
      }
    });
  }

  gtmOnLoad(event: any) {
    const user: IUser = this.util.getUserData();
    const currency = this.util.storage.getFromSession('currency');
    const gtmPush = {
      event: 'virtual_pageview',
      page_version: 'A',
      login_status: user ? 'logged in' : 'not logged in', // Populate either LOGGED IN or NOT LOGGED IN
      user_type: user ? user.entity_type : 'visitor',
      currency: currency, // Currency used
      // session_id: '',
      user_id: user ? user.id : '',   // Identifies unique users across multiple devices
      page_category: event.category,  // ex: home, crowdfunding, fundraiser etc
      page_name: event.page_name,  // name of the page
      sip: event.sip || false  // name of the page
    };
    this.vars.gtmPageData = gtmPush;
    this.events.gtmPush(gtmPush);
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

  setDeviceType() {
    this.vars.deviceType = this.vars.isMobile ? 'mobile' : 'desktop';
    const platform = this.util.storage.getCookie('platform');
    if (platform) {
      this.vars.deviceType = platform;
    }
    if (this.qParams['platform']) {
      this.util.storage.addSessionData('platform', this.qParams['platform']);
    }
    const sesPlatform = this.util.storage.getFromSession('platform');
    if (sesPlatform) {
      this.vars.deviceType = sesPlatform;
    }
  }

  getClientIP() {
    const ip = this.util.storage.getFromSession('iplocation');
    if (ip) {
      this.setClientIP(ip);
    } else {
      this.api.get(API_URLS.GET_IP).subscribe({
        next: (res: any) => {
          this.setClientIP(res?.data);
        },
        error: (err: any) => {
          this.setClientIP();
        }
      });
    }
  }

  setClientIP(ip: ICLientData = DefaultIPLocation) {
    const criteoPartnerIDs: any = {
      'IN': 56509,
      'AE': 69550
    };
    this.vars.clientLocationData$.next(ip);
    const criteoId = criteoPartnerIDs[ip.country_name] || 66025;
    this.events.gtmPush({ 'CriteoPartnerID': criteoId });
    this.util.storage.checkFromSession('iplocation', ip);
    this.setCurrency(ip);
  }

  setCurrency(ip: ICLientData) {
    const currencyFromUrl = this.actRoute.snapshot.queryParams['selected_currency'];
    const currencyFromCode = this.util.getCurrencyFromCode(ip.country_code);
    const currencyFromSession = this.util.storage.getFromSession('currency');
    if (currencyFromUrl) {
      this.util.setCurrency(currencyFromUrl);
    } else if (currencyFromSession) {
      this.util.setCurrency(currencyFromSession);
    } else if (currencyFromCode) {
      this.util.setCurrency(currencyFromCode?.currency || '');
    }
  }

  setUser() {
    try {
      const user = this.util.getUser()?.user;
      if (user && !this.vars.isVariableLogin) {
        this.util.setLogginStatus(user.isLoggedIn);
        this.vars.userData$.next(this.util.getUserData());
        const domain = environment.name === 'local' ? 'localhost' : '.' + this.vars.domain_details?.url;
        this.util.storage.setCookie('is_logged_in', 'true', 365, domain);
      }
    } catch (error) {
      console.log(error);
    }
  }

  getDomain() {
    const url = API_URLS.GET_DOMAIN;
    this.api.get(url).subscribe({
      next: (res: any) => {
        this.setSeo({ domainName: res?.data?.name || '', logo: res?.data?.logo, favicon: res?.data?.favicon?.path });
        if (res?.data?.theme?.theme_color && this.vars.isBrowser) {
          document.documentElement.style.setProperty('--primary-color', res.data.theme.theme_color);
          const code = this.util.hexToRgb(res.data.theme.theme_color);
          if (code) {
            document.documentElement.style.setProperty('--primary-hover-color', `rgb(${code.r}, ${code.g}, ${code.b}, 1)`);
            document.documentElement.style.setProperty('--primary-color-rgb', `rgb(${code.r}, ${code.g}, ${code.b})`);
            ['05', 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(val => {
              document.documentElement.style.setProperty(`--primary-color-shadow-${val}`, `rgb(${code.r}, ${code.g}, ${code.b}, 0.${val})`);
            });
          }
        }
        this.vars.isDomainLoaded$.next(true);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  setSeo(data?: { domainName?: string, logo?: { light?: string, dark?: string }, favicon?: string }) {
    if (data?.domainName) {
      this.vars.domain_details.name = data?.domainName || '';
    }
    this.util.setPageTitle(this.vars.domain_details?.name || '');
    this.util.setLogo(data?.logo);
    this.util.setFavicon(data?.favicon || '');
  }

}
