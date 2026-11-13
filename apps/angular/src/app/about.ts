import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { site } from './data';
import { Seo } from './seo';

@Component({
  selector: 'app-about',
  template: `
    <section class="about">
      <h1>About</h1>
      <img class="about-avatar" src="/images/avatar.webp" [alt]="'Portrait of ' + site.author" width="160" height="160" />
      <div [innerHTML]="aboutHtml"></div>
    </section>
  `,
})
export class About {
  protected readonly site = site;
  // Trusted markup from content/posts.json, so the sanitizer is bypassed on purpose.
  protected readonly aboutHtml = inject(DomSanitizer).bypassSecurityTrustHtml(site.aboutHtml);

  constructor() {
    inject(Seo).set({
      path: '/about',
      title: 'About',
      description: `About ${site.author} and ${site.title}.`,
      image: '/images/avatar.webp',
    });
  }
}
