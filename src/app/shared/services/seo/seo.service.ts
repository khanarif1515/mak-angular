import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ISeoMeta, SeoPageData } from '../../models/seo-data';
import { VariableService } from '../variable/variable.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    @Inject(DOCUMENT) public document: any,
    public title: Title,
    private meta: Meta,
    private router: Router,
    private vars: VariableService
  ) { }

  addMetaTags(tags: MetaDefinition[]) {
    tags.forEach(tag => {
      if (tag.name || tag.property) {
        this.meta.updateTag(tag);
      }
    });
  }

  removeMetaTags(tags: MetaDefinition[]) {
    tags.forEach(tag => {
      if (tag.name) {
        this.meta.removeTag(`name='${tag.name}'`);
      }
      if (tag.property) {
        this.meta.removeTag(`property='${tag.property}'`);
      }
    });
  }

  createMetaDefinition(data?: ISeoMeta): MetaDefinition[] {
    const pageTags = SeoPageData[this.vars.origin];
    const seoData = {
      ...pageTags,
      site: this.vars.domain_details?.url || '',
      image: '/assets/images/mak-logo.webp',
      pageUrl: this.vars.domain_details?.fullUrl + this.router.url.split('?')[0],
      ...data
    };

    const baseTags: MetaDefinition[] = [
      { name: 'author', content: seoData.site },
      { name: 'description', content: seoData.desc || '' },
      { name: 'keywords', content: seoData.keywords || '' },
      { property: 'og:title', content: seoData.title || '' },
      { property: 'og:description', content: seoData.ogDesc || seoData?.desc || '' },
      { property: 'og:site_name', content: seoData.site },
      // { property: 'og:type', content: '' },
      { property: 'og:url', content: seoData.pageUrl },
      { property: 'og:image', content: seoData.image },
      { property: 'og:image:secure_url', content: seoData.image },
      { name: 'twitter:title', content: seoData.twitterTitle || seoData.title || '' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: seoData.site },
      { name: 'twitter:image', content: seoData.image },
      { name: 'twitter:description', content: seoData.twitterDesc || seoData.desc || '' },
      // { property: 'fb:app_id', content: environment.facebook_id },
    ];

    if (seoData?.robots) {
      baseTags.push({ name: 'robots', content: seoData?.robots });
    }

    return baseTags;
  }

  // Schema.Org object
  setSchemaObject(seoJson: any, type: 'head' | 'body', id?: string | number) {
    if (!seoJson) { return; }
    const s = this.document.createElement('script');
    s.type = 'application/ld+json';
    s.innerHTML = JSON.stringify(seoJson);
    if (id) { s.id = id; }
    const head = this.document.getElementsByTagName(type)[0];
    head.appendChild(s);
  }

  setCanonical(url?: string) {
    url = url || `${this.vars.domain_details.fullUrl}${this.router.url.split('?')[0]}`;
    const existingRel: any = this.document.querySelector('link[rel="canonical"]');
    if (existingRel) {
      existingRel.href = url;
    } else {
      const link: HTMLLinkElement = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
      link.setAttribute('href', url);
    }
  }

  // createAmpHtml(page: string, customTag: string) {
  //   const url = environment.APP.DOMAIN_URL + `/amp/${page}/${encodeURIComponent(customTag)}`;
  //   const existingRel: any = this.document.querySelector('link[rel="amphtml"]');
  //   if (existingRel) {
  //     existingRel.href = url;
  //   } else {
  //     const link: HTMLLinkElement = this.document.createElement('link');
  //     link.setAttribute('rel', 'amphtml');
  //     this.document.head.appendChild(link);
  //     link.setAttribute('href', url);
  //   }
  // }

  // removeAmpHtml() {
  //   const existingAmpHtml = this.document.querySelector('link[rel="amphtml"]');
  //   if (existingAmpHtml) {
  //     existingAmpHtml.remove();
  //   }
  // }

  // Schema object for videos
  schamObjectForVideos(data: any) {
    const videoObject = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      'name': data.title,
      'description': data.desc,
      'thumbnailUrl': `https://img.youtube.com/vi/${data.videoId}/0.jpg`,
      'uploadDate': `${data.startDate}`,
      'contentUrl': `https://www.youtube.com/embed/${data.videoId}`
    };
    this.setSchemaObject(videoObject, 'head');
  }
}
