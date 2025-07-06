import { Component, inject } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { SeoS, UtilS, VarS } from './shared/services';
import { LayoutConfig, PAGE_ORIGIN_MAP } from './shared/models/layout.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly seo = inject(SeoS);
  private readonly util = inject(UtilS);
  readonly vars = inject(VarS);

  ngOnInit() {
    this.routeChangeListener();
    console.log(this.vars.isBrowser)
    if (this.vars.isBrowser) {
      console.log(this.vars.hostData);
    }
    const webPageSchema = {
      '@context': 'http://schema.org',
      '@id': `${this.vars.hostData.url}`,
      '@type': 'WebPage',
      'url': `${this.vars.hostData.url}`,
      'name': `${this.vars.hostData.name}`
    };
    this.seo.setSchemaObject(webPageSchema);
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
          this.vars.origin = data['or'] || '';
          this.vars.pageName = PAGE_ORIGIN_MAP[this.vars.origin];
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
}
