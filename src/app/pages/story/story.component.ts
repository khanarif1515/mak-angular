import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IFundraiser } from 'src/app/shared/models/fundraiser.model';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { UtilService } from 'src/app/shared/services/util/util.service';
import { VariableService } from 'src/app/shared/services/variable/variable.service';
import { API_URLS } from 'src/environments/api-urls';

@Component({
  selector: 'app-story',
  imports: [],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss'
})
export class StoryComponent implements OnInit {

  customTag = '';
  currency = 'INR';
  pCurrency = '';
  currentLanguage = 'en';
  isShortStory = false;

  fundraiser?: IFundraiser;

  constructor(
    private actRoute: ActivatedRoute,
    private api: ApiService,
    private seo: SeoService,
    private util: UtilService,
    public vars: VariableService
  ) { }

  ngOnInit(): void {
    this.actRoute.params.subscribe((params) => {
      this.customTag = params['tag'];
      // this.seo.createAmpHtml('stories', this.customTag);
      this.getStoryData();
    });
  }

  getStoryData(currency: string = this.currency) {
    console.log(currency);
    let url = API_URLS.GET_FUNDRAISER(this.customTag) + `?currency=${currency}&with=viewmedicalbill;gallery;basicinfo;beneficiary.avtar;campaigner.avtar;manager.entity;`;
    url = url + 'userFollowed;likescount;banktransfer;cause;campaigner.social;theater;storyTitle;storyDescription;leaderboard;doctorDetails;';
    url = url + 'hospitalOnly;videoAppeal;beneficiaryname;mediaBeneficiary;mswName;mswDate;ctaLabel;costbreakdown;isMultiPatient';
    url = url + `&page_type=${this.vars.pageName}&short_story=${this.isShortStory}&lang=${this.currentLanguage}&device=${this.vars.deviceType}`;

    this.api.get(url).subscribe({
      next: (res: any) => {
        this.fundraiser = res.data;
        this.setSeoData();
        // console.log(this.fundraiser);
      },
      error: (err: any) => {
        // console.log(err);
      }
    });
  }

  setSeoData() {
    this.seo.title.setTitle(this.util.capitalizeFirstLetter(this.fundraiser?.story_title?.info_1));
    this.vars.seoMetaTags = this.seo.createMetaDefinition({
      title: this.fundraiser?.story_title?.info_1 || '',
      desc: this.util.getTextFromHtmlTring(this.fundraiser?.story_description?.info_1),
      keywords: 'story',
      image: this.fundraiser?.leaderboard?.cdn_path || this.vars.domain_details.logoLightBg
    });
    this.seo.addMetaTags(this.vars.seoMetaTags);
  }

}
