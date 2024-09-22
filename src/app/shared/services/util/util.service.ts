import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';
import { VariableService } from '../variable/variable.service';
import { Domains } from '../../models/domains';
import { SeoService } from '../seo/seo.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    @Inject(DOCUMENT) public document: any,
    @Inject(PLATFORM_ID) public platformId: Object,
    public router: Router,
    public seo: SeoService,
    public storage: StorageService,
    public vars: VariableService
  ) {
    this.vars.isBrowser = isPlatformBrowser(this.platformId);
    if (this.vars.isBrowser) {
      this.isMobile();
      this.setDomainDetails(location.host);
    } else {
      this.setDomainDetails('');
    }
  }

  isMobile() {
    if (this.vars.isBrowser) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        this.vars.isMobile = true;
      }
    }
    return this.vars.isMobile;
  }

  setDomainDetails(url: string) {
    const domainData = Domains[url] || Domains['default'];
    this.vars.domain_details = {
      favicon: domainData.favicon,
      fullUrl: domainData.fullUrl,
      apiUrl: domainData.apiUrl,
      logoDarkBg: domainData.logoDarkBg,
      logoLightBg: domainData.logoLightBg,
      name: domainData.name,
      url: domainData.url
    }
    // console.log(this.vars.domain_details);
  }

  capitalizeFirstLetter(text?: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  getTextFromHtmlTring(htmlString?: string) {
    if (!htmlString) return '';
    const storyDesc = this.document.createElement('div');
    storyDesc.innerHTML = htmlString.replace(/<img[^>]*>/g, ''); // Remove all <img> tags
    let content = storyDesc.textContent?.trim().replace(/\s+/g, ' ') || ''; // Remove newlines and extra spaces
    return content.length > 155 ? content.substring(0, 155).concat('...') : content;
  }
}
