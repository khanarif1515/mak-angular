import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ICurrency } from 'src/app/shared/model/currency.model';
import { IFundraiser } from 'src/app/shared/model/fundraiser.model';
import { IUser } from 'src/app/shared/model/user.model';
import { ApiService, SeoService, UtilService, VariablesService } from 'src/app/shared/services';
import { API_URLS } from 'src/environments/api-urls';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss'
})
export class StoryComponent implements OnInit, OnDestroy {

  customTag = '';
  currency = '';
  currencyInfo?: ICurrency;
  fundraiser?: IFundraiser;
  isShortStory = false;
  currentLanguage = 'en';
  userData?: IUser;
  qParams: any;
  seoTags: any;
  subs: Subscription[] = [];

  constructor(
    private actRoute: ActivatedRoute,
    private api: ApiService,
    private seo: SeoService,
    private util: UtilService,
    public vars: VariablesService
  ) { }

  ngOnInit(): void {
    this.readyPage();
  }

  readyPage() {
    this.qParams = { ...this.actRoute.snapshot.queryParams };
    this.currency = this.vars.currency;
    this.currencyInfo = this.util.getCurrencyIcon(this.currency);
    this.util.scrollToTop('instant');
    this.subs.push(this.vars.userData$.subscribe({
      next: res => {
        if (res) {
          this.userData = res;
        }
      }
    }));
    this.subs.push(this.actRoute.queryParams.subscribe(params => {
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
    this.fundraiser = undefined;
    this.vars.fundraiser = undefined;
    let url = API_URLS.GET_FUNDRAISER(this.customTag) + `?currency=${currency}&with=viewmedicalbill;gallery;basicinfo;beneficiary.avtar;campaigner.avtar;manager.entity;`;
    url = url + 'userFollowed;likescount;banktransfer;cause;campaigner.social;theater;storyTitle;storyDescription;leaderboard;doctorDetails;';
    url = url + 'hospitalOnly;videoAppeal;beneficiaryname;mediaBeneficiary;mswName;mswDate;ctaLabel;costbreakdown;isMultiPatient';
    url = url + `&page_type=${this.vars.pageName}&short_story=${this.isShortStory}&lang=${this.currentLanguage}&device=${this.vars.deviceType}`;

    this.api.get(url).subscribe({
      next: (res: any) => {
        if (!res?.data) { console.log(res); this.util.router.navigate(['/404']); return; }

        this.fundraiser = res.data;
        this.vars.fundraiser = res.data;
        this.addMetaTags();

        this.vars.isStoryDataLoading = false;
      },
      error: err => {
        // console.log(err);
        this.vars.isStoryDataLoading = false;
        this.util.router.navigate(['/404']);
      }
    });
  }

  addMetaTags() {
    this.util.setPageTitle(this.fundraiser?.story_title?.info_1 || this.fundraiser?.title || 'NGO');
    const metaData = this.seo.stroyPageMetaTags(this.fundraiser);
    this.seoTags = this.seo.createTagObject(metaData);
    this.vars.metaDataOfPage = metaData;
    this.seo.addMetaTags(this.seoTags);
    this.seo.updateCanonicalURL(`/stories/` + this.fundraiser?.custom_tag);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.seo.removeMetaTags(this.seoTags);
    this.seo.removeAmpHtml();
    this.vars.isStoryDataLoading = false;
    this.vars.fundraiser = undefined;
  }
}
