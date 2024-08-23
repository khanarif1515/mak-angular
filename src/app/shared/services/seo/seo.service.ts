import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilService } from '../util/util.service';
import { VariablesService } from '../variables/variables.service';
import { IFundraiser } from '../../model/fundraiser.model';
import { Meta, MetaDefinition } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    public meta: Meta,
    private util: UtilService,
    private vars: VariablesService
  ) { }

  createAmpHtml(page: string, customTag: string) {
    const url = this.vars.domain_details?.domain_url + `/amp/${page}/${encodeURIComponent(customTag)}`;
    const existingRel: any = this.vars.document.querySelector('link[rel="amphtml"]');
    if (existingRel) {
      existingRel.href = url;
    } else {
      const link: HTMLLinkElement = this.vars.document.createElement('link');
      link.setAttribute('rel', 'amphtml');
      this.vars.document.head.appendChild(link);
      link.setAttribute('href', url);
    }
  }

  removeAmpHtml() {
    const existingAmpHtml = this.vars.document.querySelector('link[rel="amphtml"]');
    if (existingAmpHtml) {
      existingAmpHtml.remove();
    }
  }

  createCanonicalURL() {
    let url = this.vars.document.URL;
    if (!this.vars.isBrowser) {
      url = this.vars.domain_details?.domain_url;
    }
    const existingRel: any = this.vars.document.querySelector('link[rel="canonical"]');
    if (existingRel) {
      existingRel.href = url;
    } else {
      const link: HTMLLinkElement = this.vars.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.vars.document.head.appendChild(link);
      link.setAttribute('href', url);
    }
  }

  updateCanonicalURL(url: string) {
    const existingRel: any = this.vars.document.querySelector('link[rel="canonical"]');
    if (existingRel) {
      existingRel.href = this.vars.domain_details?.domain_url + url;
    }
  }

  schemaOrgObject(seoJson: any, id?: any) {
    if (!seoJson) { return; }
    const s = this.vars.document.createElement('script');
    s.type = 'application/ld+json';
    s.innerHTML = JSON.stringify(seoJson);
    if (id) { s.id = id; }
    const head = this.vars.document.getElementsByTagName('head')[0];
    head.appendChild(s);
  }

  stroyPageMetaTags(fundraiser?: IFundraiser) {
    const storyDesc = this.vars.document.createElement('div');
    const htmlString = fundraiser?.story_description?.info_1 || '';
    storyDesc.innerHTML = htmlString.replace(/<img[^>]*>/g, '');
    let content: string = storyDesc.textContent.replace(/(\r\n|\n|\r)/gm, '');
    content = content.length > 155 ? content.substring(0, 155).concat('...') : content;
    const campaignerName = fundraiser?.campaigner?.full_name || '';
    return {
      description: `${this.util.capitalizeFirstLatter(campaignerName)}, ${content}`,
      keywords: 'story',
      campaigner: campaignerName,
      title: fundraiser?.story_title?.info_1 || fundraiser?.title || '',
      image: fundraiser?.leaderboard?.cdn_path || fundraiser?.theater?.cdn_path || '',
      url: `${this.vars.domain_details?.domain_url}/stories/${fundraiser?.custom_tag}`,
      site: ''
    };
  }

  createTagObject(data: any): MetaDefinition[] {
    const tags: MetaDefinition[] = [
      { name: 'author', content: data?.site },
      { name: 'description', content: data?.description },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '' },
      { name: 'twitter:image', content: data?.image },
      { name: 'twitter:description', content: data?.description },
      { property: 'fb:app_id', content: environment.facebook_id },
      { property: 'og:title', content: data?.title },
      { property: 'og:site_name', content: data?.site },
      { property: 'og:type', content: '' },
      { property: 'og:url', content: data?.url },
      { property: 'og:image', content: data?.image },
      { property: 'og:image:secure_url', content: data?.image },
      { property: 'og:description', content: data?.description },
    ];

    if (data?.robots) {
      tags.push({ name: 'robots', content: data?.robots });
    }

    if (data?.campaigner) {
      tags.push({
        name: 'keywords',
        content: `${data?.title?.trim()}, ${data.campaigner?.trim()}, crowdfunding platform in India, raise funds, ${data?.keywords}`
      });
      tags.push({
        name: 'twitter:title',
        content: `${data?.title?.trim()} by ${data?.campaigner?.trim()}`
      });
    } else {
      tags.push({
        name: 'keywords',
        content: `${data?.title?.trim()}, crowdfunding platform in India, raise funds, ${data?.keywords}`
      });
      tags.push({
        name: 'twitter:title',
        content: `${data?.title?.trim()}`
      });
    }
    return tags;
  }

  addMetaTags(data: MetaDefinition[]) {
    for (const item of data) {
      if (item.name) {
        this.meta.updateTag(item);
      }
      if (item.property) {
        this.meta.updateTag(item);
      }
    }
  }

  removeMetaTags(data: MetaDefinition[]) {
    if (data && data.length) {
      for (const item of data) {
        if (item.name) {
          this.meta.removeTag(`name='${item.name}'`);
        }
        if (item.property) {
          this.meta.removeTag(`property='${item.property}'`);
        }
      }
    }
  }

  schamObjectForVideos(data: any) {
    const videoObject = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      'name': data?.title,
      'description': data?.desc,
      'thumbnailUrl': `https://img.youtube.com/vi/${data?.videoId}/0.jpg`,
      'uploadDate': `${data?.startDate}`,
      'contentUrl': `https://www.youtube.com/embed/${data?.videoId}`
    };
    this.schemaOrgObject(videoObject);
  }
}
