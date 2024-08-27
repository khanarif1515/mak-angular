import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button'
import { MatRippleModule } from '@angular/material/core'
import { ApiService, SeoService, UtilService, VariablesService } from 'src/app/shared/services';
import { BannerComponent } from './components/banner/banner.component';
import { Subscription } from 'rxjs';
import { EventsService } from 'src/app/shared/services/events/events.service';
import { homepageContent } from 'src/app/shared/model/homepage';
import { API_URLS } from 'src/environments/api-urls';
import { MetaDefinition } from '@angular/platform-browser';
import { FundraiserSlideComponent } from 'src/app/core/fundraiser-slide/fundraiser-slide.component';
import { TaxBenefitBannerComponent } from 'src/app/core/tax-benefit-banner/tax-benefit-banner.component';
import { OurMissionComponent } from 'src/app/core/our-mission/our-mission.component';
import { WhyUsComponent } from 'src/app/core/why-us/why-us.component';
import { HowItWorksComponent } from 'src/app/core/how-it-works/how-it-works.component';
import { FaqComponent } from 'src/app/core/faq/faq.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule, MatButtonModule, MatRippleModule, BannerComponent, FundraiserSlideComponent, TaxBenefitBannerComponent,
    OurMissionComponent, WhyUsComponent, HowItWorksComponent, FaqComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  currency = 'INR';
  fundraisers = [];
  metaData?: MetaDefinition[];
  data: any;
  subs: Subscription[] = [];

  constructor(
    private api: ApiService,
    private events: EventsService,
    private util: UtilService,
    public vars: VariablesService,
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    this.readyPage();
    // this.subs.push(this.vars.isDomainLoaded$.subscribe({
    //   next: (res) => {
    //     if (res) {
    //       this.setSeoData();
    //       this.data = homepageContent(this.vars.domain_details.name || '');
    //     }
    //   }
    // }));

    // this.subs.push(this.vars.currency$.subscribe({
    //   next: (res) => {
    //     if (res) {
    //       this.currency = res;
    //       this.getFundraisers();
    //     }
    //   }
    // }));
    // this.events.onLoadSystemEvent({
    //   eventName: 'pageView'
    // });

    console.log('name = ', this.vars.domain_details.name);
    console.log('url = ', this.vars.domain_details.url);
    console.log('fullUrl = ', this.vars.domain_details.fullUrl);
    console.log('logoLightBg = ', this.vars.domain_details.logoLightBg);
    console.log('logoDarkBg = ', this.vars.domain_details.logoDarkBg);
    console.log('favicon = ', this.vars.domain_details.favicon);
  }

  readyPage() {
    this.data = homepageContent(this.vars.domain_details.name || '');
    this.setSeoData();
  }

  getFundraisers() {
    const url = API_URLS.GET_CAMPAIGNS + '?tags=featured&limit=6&with=beneficiaryname;theater;storyWidget;mediaBeneficiary';
    this.api.get(url).subscribe({
      next: (res: any) => {
        this.fundraisers = res?.data?.data || [];
      },
      error: err => { }
    });
  }

  setSeoData() {
    const title = this.vars.domain_details.name + ' | Save Lives | Contribution';
    const desc = `${this.vars.domain_details.name} to save lives of people who are in urgent need of funds for expensive medical treatments. Contribute to ${this.vars.domain_details.name}!`;
    const keywords = `${this.vars.domain_details.name}, save lives, funds for medical treatments, save lives, funds for medical treatments`;
    this.util.setPageTitle(title);
    this.metaData = [
      { name: 'author', content: this.vars.domain_details?.url || '' },
      { name: 'description', content: desc },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:site_name', content: this.vars.domain_details?.name || '' },
      { property: 'og:url', content: this.vars.domain_details?.url || '' },
      { property: 'og:image', content: this.vars.domain_details?.logoDarkBg || this.vars.domain_details?.logoLightBg || '' },
      { property: 'og:description', content: desc },
      { property: 'twitter:title', content: title },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '' },
      { name: 'twitter:image', content: this.vars.domain_details?.logoDarkBg || this.vars.domain_details?.logoLightBg || '' },
      { name: 'twitter:description', content: desc },
      // { property: 'fb:app_id', content: environment.facebook_id },
    ]
    this.seo.addMetaTags(this.metaData);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.seo.removeMetaTags(this.metaData || []);
  }
}
