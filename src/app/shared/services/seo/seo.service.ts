import { inject, Injectable } from '@angular/core';
import { UtilService } from '../util/util.service';
import { VarService } from '../var/var.service';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ITagObj, SEODATA } from '../../models/seo.model';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  readonly title = inject(Title);
  readonly meta = inject(Meta);
  private readonly util = inject(UtilService);
  private readonly vars = inject(VarService);

  constructor() { }

  setPageTitle(title?: string) {
    title = title || SEODATA?.[this.vars.origin]?.title;
    this.title.setTitle(title.replace(/{{HOST_NAME}}/g, this.vars.hostData.name));
  }

  setDefaultMeta() {
    const seoTag = SEODATA?.[this.vars.origin];
    if (seoTag) {
      const url = this.util.getCurrentUrl();
      this.addMetaTags(this.getTagObject({
        ...seoTag,
        url: url
      }));
    }
  }

  setCanonical() {
    const url = this.util.getCurrentUrl();
    let canonicalLink = this.vars.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = this.vars.document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      this.vars.document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;
  }

  updateCanonical(url: string) {
    const link = this.vars.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    !url && link ? link?.remove() : link ? link.href = url : null;
  }

  setAmpHtml(page: string, customTag: string) {
    const encodedTag = encodeURIComponent(customTag);
    const ampUrl = `${this.vars.hostData.fullUrl}/amp/${page}/${encodedTag}`;
    let link = this.vars.document.querySelector<HTMLLinkElement>('link[rel="amphtml"]');
    if (!link) {
      link = this.vars.document.createElement('link');
      link.setAttribute('rel', 'amphtml');
      this.vars.document.head.appendChild(link);
    }
    link.href = ampUrl;
  }

  updateAmpHtml(url: string) {
    const link = this.vars.document.querySelector<HTMLLinkElement>('link[rel="amphtml"]');
    !url && link ? link?.remove() : link ? link.href = url : null;
  }

  setSchemaObject(seoJson: Record<string, any>, id?: string) {
    if (!seoJson) return;
    const script = this.vars.document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(seoJson);
    if (id) {
      script.id = id;
      const existing = this.vars.document.getElementById(id);
      existing?.remove();
    }
    this.vars.document.head.appendChild(script);
  }

  addMetaTags(data: MetaDefinition[]) {
    data?.forEach(tag => {
      if (tag.name || tag.property) {
        this.meta.updateTag(tag);
      }
    });
  }

  removeMetaTags(data: MetaDefinition[]) {
    data?.forEach(tag => {
      if (tag.name) {
        this.meta.removeTag(`name='${tag.name}'`);
      }
      if (tag.property) {
        this.meta.removeTag(`property='${tag.property}'`);
      }
    });
  }

  getTagObject(data: ITagObj): MetaDefinition[] {
    const { title, description, image, keywords, robots, seoTitle, site, twitterTitle, url } = data;
    const tags: MetaDefinition[] = [
      { name: 'author', content: site || '' },
      { name: 'keywords', content: keywords || '' },
      { name: 'description', content: description || '' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: site || '' },
      { name: 'twitter:site', content: site || '' },
      { name: 'twitter:title', content: twitterTitle || seoTitle || title },
      { name: 'twitter:image', content: image || ((this.vars.isBrowser ? window.location.origin : '') + this.vars.hostData.logoLightBg) },
      { name: 'twitter:description', content: description || '' },
      { name: 'robots', content: robots || 'index, follow' },
      { property: 'og:title', content: seoTitle || title },
      { property: 'og:description', content: description || '' },
      { property: 'og:url', content: url || '' },
      { property: 'og:site_name', content: site || '' },
      { property: 'og:image', content: image || '' },
      { property: 'og:image:secure_url', content: image || '' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'en_US' }
    ];
    return tags.map(item => {
      if (item.content) item.content = item.content.replace(/{{HOST_NAME}}/g, this.vars.hostData.name);
      return item;
    });
  }

  setVideoschamObject(data: { videoId: string | number, title: string, desc?: string, startDate?: string }) {
    const videoSchema = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: data.title,
      description: data?.desc || '',
      thumbnailUrl: `https://img.youtube.com/vi/${data.videoId}/0.jpg`,
      uploadDate: data.startDate || new Date().toISOString(),
      contentUrl: `https://www.youtube.com/embed/${data.videoId}`
    };
    this.setSchemaObject(videoSchema, 'schema-video');
  }
}
