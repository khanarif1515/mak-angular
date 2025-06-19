import { Component, inject } from '@angular/core';
import { ApiService, SeoService, UtilService, VarService } from '../../shared/services';
import { IFundraiser } from '../../shared/models/fundraiser.model';
import { ActivatedRoute } from '@angular/router';
import { ApiEndPoints } from '../../shared/models/api-endpoints.model';

@Component({
  selector: 'app-story',
  imports: [],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss'
})
export class StoryComponent {

  private readonly actRoute = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly util = inject(UtilService);
  private readonly seo = inject(SeoService);
  readonly vars = inject(VarService);

  customTag = '';
  currency = 'INR';
  fundraiser?: IFundraiser;
  isShortStory = false;
  currentLanguage = 'en';

  ngOnInit() {
    this.readyPage();
  }

  readyPage() {
    this.actRoute.params.subscribe(params => {
      this.customTag = params['tag'];
      setTimeout(() => {
        this.getStory();
      }, 0);
    });
  }

  getStory() {
    const endpoint = ApiEndPoints.campaign(this.customTag);

    const params = {
      currency: this.currency,
      page_type: this.vars.pageName,
      short_story: this.isShortStory,
      lang: this.currentLanguage,
      device: this.vars.deviceType,
      device1: null,
      // skipSanitize: 1,
      with: `viewmedicalbill;gallery;basicinfo;beneficiary.avtar;campaigner.avtar;manager.entity;userFollowed;likescount;banktransfer;cause;campaigner.social;theater;storyTitle;storyDescription;leaderboard;doctorDetails;hospitalOnly;videoAppeal;beneficiaryname;mediaBeneficiary;mswName;mswDate;ctaLabel;costbreakdown;isMultiPatient`
    };
    // this.api.requestBackend('get', url, params).subscribe({
    //   next: (res: any) => {
    //     this.fundraiser = res?.data;
    //     console.log(this.fundraiser);
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //   }
    // });

    this.api.request('get', endpoint, params).subscribe({
      next: (res: any) => {
        this.fundraiser = res?.data;
        this.stroyPageMetaTags();
        if (this.vars.isBrowser) {
          console.log(this.fundraiser);
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });

  }

  stroyPageMetaTags() {
    const fundraiser = this.fundraiser;
    const storyDesc = this.vars.document.createElement('div');
    storyDesc.innerHTML = (fundraiser?.story_description?.info_1 || '').replace(/<img[^>]*>/g, '');
    let content = storyDesc.textContent?.replace(/(\r\n|\n|\r)/gm, '').trim() || '';
    content = content.length > 155 ? `${content.slice(0, 155)}...` : content;
    const campaignerName = fundraiser?.campaigner?.full_name || '';
    const title = fundraiser?.story_title?.info_1 || fundraiser?.title || this.customTag;
    const image = fundraiser?.leaderboard?.cdn_path || fundraiser?.theater?.cdn_path || '';
    const url = `${this.vars.hostData.url}/stories/${fundraiser?.custom_tag}`;
    const data = {
      description: `${this.util.capitalizeFirstLetter(campaignerName)}, ${content}`,
      keywords: 'story',
      campaigner: campaignerName,
      title,
      image,
      url,
      site: ''
    };
    if (title) {
      this.seo.setPageTitle(title);
    }
    this.seo.addMetaTags(this.seo.getTagObject(data));
  }
}
