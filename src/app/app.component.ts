import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { UtilService } from './shared/services/util/util.service';
import { VariableService } from './shared/services/variable/variable.service';
import { IPageOrigins, PAGE_ORIGIN_MAP, PageLayoutConfig } from './shared/models/layout-config.model';
import { SeoService } from './shared/services/seo/seo.service';
import { SeoPageData } from './shared/models/seo-data';

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

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private util: UtilService,
    private vars: VariableService
  ) { }

  ngOnInit(): void {
    this.qParams = { ...this.actRoute.snapshot.queryParams };
    this.routeChangeListner();
    if (this.vars.isBrowser) {
      this.setDeviceType();
    }
  }

  routeChangeListner() {
    this.router.events.pipe(
      // Filter to listen only for NavigationEnd event (when navigation is done)
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.vars.previousUrlPath = this.vars.currentUrlPath;
      this.vars.currentUrlPath = event?.url;

      // Get the deepest activated route (the one that has the 'data' property)
      let child = this.actRoute.firstChild;
      while (child?.firstChild) {
        child = child.firstChild;
      }
      this.vars.origin = child?.snapshot?.data?.['origin'] || '';
      this.vars.pageName = PAGE_ORIGIN_MAP[this.vars.origin];
      this.vars.pageLayoutConfig = PageLayoutConfig[this.vars.origin];
      // console.log('page or = ', this.vars.origin);
      // console.log('page name = ', this.vars.pageName);
      // console.log('current url = ', this.vars.currentUrlPath);
      // console.log('previous url = ', this.vars.previousUrlPath);
      this.seo.title.setTitle(SeoPageData[this.vars.origin]?.title || SeoPageData.h.title);
      this.seo.setCanonical();
      this.seo.removeMetaTags(this.vars.seoMetaTags);
      if (this.vars.origin !== 's') {
        this.vars.seoMetaTags = this.seo.createMetaDefinition();
        this.seo.addMetaTags(this.vars.seoMetaTags);
      }
    });
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
}
