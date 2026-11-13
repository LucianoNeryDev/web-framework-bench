import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { posts, site } from './data';
import { PostCard } from './post-card';
import { Seo } from './seo';

@Component({
  selector: 'app-home',
  imports: [RouterLink, PostCard],
  template: `
    <section class="hero">
      <div class="hero-text">
        <h1>{{ site.heroTitle }}</h1>
        <p>{{ site.heroText }}</p>
        <p><a class="button" routerLink="/blog">Read the blog</a></p>
      </div>
      <img
        class="hero-image"
        src="/images/hero.webp"
        alt="Abstract illustration of overlapping circles"
        width="1600"
        height="900"
        fetchpriority="high"
      />
    </section>
    <section class="latest" aria-labelledby="latest-heading">
      <h2 id="latest-heading">Latest posts</h2>
      <div class="card-grid">
        @for (p of latest; track p.slug) {
          <article appPostCard [post]="p"></article>
        }
      </div>
      <p class="section-footer"><a routerLink="/blog">All posts →</a></p>
    </section>
  `,
})
export class Home {
  protected readonly site = site;
  protected readonly latest = posts.slice(0, 6);

  constructor() {
    inject(Seo).set({ path: '/', title: site.title, description: site.description, image: '/images/hero.webp' });
  }
}
