import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ICurrency } from 'src/app/shared/model/currency.model';
import { IFundraiser } from 'src/app/shared/model/fundraiser.model';
import { ICartResponse } from 'src/app/shared/model/payment.model';
import { IUser } from 'src/app/shared/model/user.model';
import { ApiService, EventsService, SeoService, UtilService, VariablesService } from 'src/app/shared/services';
import { API_URLS } from 'src/environments/api-urls';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss'
})
export class StoryComponent implements OnInit, OnDestroy {

  customTag = '';
  currency = '';
  pCurrency = '';
  currencyInfo?: ICurrency;
  fundraiser?: IFundraiser;
  isShortStory = false;
  currentLanguage = 'en';
  showDonate = false;
  userData?: IUser;
  qParams: any;
  seoTags: any;
  subs: Subscription[] = [];
  showDoc = true;
  comments: any;
  tickrIsShown = false;
  isPageReady = false;
  donors: any[] = [];
  isFailedPayChecked = false;
  currentUrl = '';

  constructor(
    private actRoute: ActivatedRoute,
    private api: ApiService,
    private seo: SeoService,
    private util: UtilService,
    public vars: VariablesService,
    private events: EventsService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url.split('?')[0];
    this.fundraiser = undefined;
    this.vars.fundraiser = undefined;
    this.readyPage();
  }

  readyPage() {
    this.qParams = { ...this.actRoute.snapshot.queryParams };
    this.currency = this.vars.currency;
    this.pCurrency = this.vars.currency;
    this.currencyInfo = this.util.getCurrencyIcon(this.currency);
    this.util.scrollToTop('instant');
    this.subs.push(this.vars.userData$.subscribe({
      next: res => {
        if (res) {
          this.userData = res;
        }
      }
    }));
    this.subs.push(this.actRoute.queryParams.subscribe((params: any) => {
      if (this.qParams?.pay === 'form' && params?.pay !== 'form' && this.fundraiser) {
        this.donationToggle(false);
      } else if (params?.pay === 'form' && this.fundraiser) {
        this.donationToggle(true);
      }
      this.qParams = { ...params };
    }));
    this.subs.push(this.actRoute.params.subscribe((params) => {
      this.customTag = params['tag'];
      this.seo.createAmpHtml('stories', this.customTag);
      this.getStoryData();
    }));

    this.subs.push(this.vars.currency$.subscribe({
      next: res => {
        if (res && res !== this.currency) {
          this.currency = res;
          this.currencyInfo = this.util.getCurrencyIcon(this.currency);
          this.getStoryData();
        }
      }
    }));
  }

  getStoryData(currency: string = this.currency) {
    if (!currency) { return; }
    this.vars.isStoryDataLoading = true;
    // this.fundraiser = undefined;
    // this.vars.fundraiser = undefined;
    let url = API_URLS.GET_FUNDRAISER(this.customTag) + `?currency=${currency}&with=viewmedicalbill;gallery;basicinfo;beneficiary.avtar;campaigner.avtar;manager.entity;`;
    url = url + 'userFollowed;likescount;banktransfer;cause;campaigner.social;theater;storyTitle;storyDescription;leaderboard;doctorDetails;';
    url = url + 'hospitalOnly;videoAppeal;beneficiaryname;mediaBeneficiary;mswName;mswDate;ctaLabel;costbreakdown;isMultiPatient';
    url = url + `&page_type=${this.vars.pageName}&short_story=${this.isShortStory}&lang=${this.currentLanguage}&device=${this.vars.deviceType}`;

    this.api.get(url).subscribe({
      next: (res: any) => {
        if (!res?.data) { console.log(res); this.util.router.navigate(['/404']); return; }
        res.data = this.util.handleFundraiserData(res.data);
        this.fundraiser = res.data;
        this.vars.fundraiser = res.data;
        this.addMetaTags();
        if (!this.tickrIsShown) { // This is to maintain tickr does not start again upon currency change
          this.tickrIsShown = true;
        }
        this.vars.isStoryDataLoading = false;
        if (this.vars.isBrowser) {
          this.pageViewEvent();
        }
        // const url = API_URLS.GET_FUNDRAISER(`${this.fundraiser!.custom_tag}/raised`);
        // this.api.get(url + `?currency=${this.currency}&page_type=${this.vars.pageName}`).subscribe((val: any) => {
        //   this.fundraiser!.raised = val.data.raised;
        //   this.fundraiser!.raised!.beforeTickrBackers = this.fundraiser!.raised ? this.fundraiser!.raised.backers : 0;
        // });
        // this.getTopDonorsAndComments(1);
        if (this.qParams?.pay === 'form') {
          this.donationToggle(true);
        }
        this.handleFailedPay();
        this.isPageReady = true;
      },
      error: err => {
        // console.log(err);
        this.vars.isStoryDataLoading = false;
        this.util.router.navigate(['/404']);
      }
    });
  }


  getTopDonorsAndComments(page: number) {
    const url = API_URLS.GET_TOP_DONORS(this.vars.fundraiser?.custom_tag);
    const qParams = `?with=activation;comments&limit=5&page=${page}&orderBy=id&sortedBy=desc&showError=false`;
    this.api.get(url + qParams).subscribe((val: any) => {
      this.comments = val.data.data;
      this.isPageReady = true;
    })
  }


  handleFailedPay() {
    if (this.isFailedPayChecked) { return; }
    this.isFailedPayChecked = true;
    const failedCart: ICartResponse = this.util.storage.getFromSession('cartData');
    if (this.qParams?.st === 'f' && failedCart?.campaign?.id === this.fundraiser?.id) {
      this.pCurrency = failedCart.cart?.currency || this.currency;
      this.donateNow(true);
    }
  }

  pageViewEvent() {
    const pageViewPayload = {
      eventName: 'pageView',
      page_name: this.vars.pageName,
      event_type_id: this.fundraiser?.id,
      event_type: 'campaign',
      info_1: this.currency,
      info_3: 'stories'
    };
    this.events.onLoadSystemEvent(pageViewPayload);
    const campaignType = `${this.util.getCampaignTypeFromId(this.fundraiser?.parent_cause_id)}`;
    const gtmData = {
      'event': 'productDetail',
      'currency': this.currency,
      'ecommerce': {
        'detail': {
          'actionField': { 'list': `${this.vars.pageName}` }, // actions have an optional list property.
          'products': [{
            'name': `${this.fundraiser?.custom_tag}`, // Campaign Name
            'id': `${this.fundraiser?.id}`, // Campaign ID.
            'category': campaignType,  // Campaign Type
            'variant': `${this.fundraiser?.cause_id}`,
            'dimension5': '', // cd_Fundraiser Attributes
            'dimension7': `${this.fundraiser?.cause_id}`, // cd_Campaign Cause ID
            'dimension8': `${this.fundraiser?.custom_tag}`, // cd_Campaign Custom Tag
            'dimension9': `${this.fundraiser?.id}`, // cd_Campaign ID
            'dimension10': campaignType // cd_Campaign Type
          }]
        }
      }
    };
    this.events.gtmPush(gtmData);
    const claverTap = {
      'Campaign Id': this.fundraiser?.id,
      'Page URL': this.vars.domain_details?.url,
      'Campaign Title': this.fundraiser?.title,
      'Browser': this.util.detectBrowser(),
      'Campaign Type': this.util.getCampaignTypeFromId(this.fundraiser?.parent_cause_id),
      'Cause ID': this.fundraiser?.cause_id,
      'Device Type': this.util.isMobile() ? 'Mobile' : 'Desktop',
      'Campaign image URL': this.fundraiser?.leaderboard?.cdn_path || '',
      'Custom Tag': this.fundraiser?.custom_tag || '',
      'campaign expiry date': this.fundraiser?.end_date
    };
    this.events.claverTapPush('Campaign Viewed', claverTap);
  }


  onStoryTabChange(event: any) {
    this.showDoc = event !== 1;
  }

  addMetaTags() {
    this.util.setPageTitle(this.fundraiser?.story_title?.info_1 || this.fundraiser?.title || 'NGO');
    const metaData = this.seo.stroyPageMetaTags(this.fundraiser);
    this.seoTags = this.seo.createTagObject(metaData);
    this.vars.metaDataOfPage = metaData;
    this.seo.addMetaTags(this.seoTags);
    this.seo.updateCanonicalURL(`/stories/` + this.fundraiser?.custom_tag);
  }

  donateNow(skipEvent = false) {
    this.util.router.navigate([this.currentUrl], { queryParams: { pay: 'form' }, queryParamsHandling: 'merge' });
  }

  goPayBack() {
    this.location.back();
  }

  donationToggle(event: boolean) {
    this.showDonate = event;
  }

  setCurrency(cur: string) {
    this.util.setCurrency(cur);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.seo.removeMetaTags(this.seoTags);
    this.seo.removeAmpHtml();
    this.vars.isStoryDataLoading = false;
    this.vars.fundraiser = undefined;
  }
}
