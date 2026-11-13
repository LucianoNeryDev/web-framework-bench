import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { site } from './data';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  image: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  set({ path, title, description, image, type = 'website' }: PageMeta): void {
    const full = path === '/' ? site.title : `${title} · ${site.title}`;
    this.titleService.setTitle(full);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:title', content: full });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: `${site.url}${image}` });
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', `${site.url}${path}`);
  }
}
