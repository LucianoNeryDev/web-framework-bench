import { Component, computed, effect, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { bySlug, tagName } from './data';
import { PostCard } from './post-card';
import { Seo } from './seo';

@Component({
  selector: 'app-post',
  imports: [RouterLink, PostCard],
  template: `
    <article class="post">
      <header class="post-header">
        <p class="post-meta"><time [attr.datetime]="post().date">{{ post().dateLabel }}</time> · {{ post().readingMinutes }} min read</p>
        <h1>{{ post().title }}</h1>
        <p class="post-summary">{{ post().summary }}</p>
        <ul class="tag-list">
          @for (t of post().tags; track t) {
            <li><a class="tag" routerLink="/blog" [queryParams]="{ tag: t }">{{ tagName[t] }}</a></li>
          }
        </ul>
      </header>
      <img
        class="post-cover"
        [src]="post().cover.src"
        [alt]="post().cover.alt"
        [attr.width]="post().cover.width"
        [attr.height]="post().cover.height"
        fetchpriority="high"
      />
      <div class="post-body" [innerHTML]="body()"></div>
    </article>
    <nav class="post-nav" aria-label="Adjacent posts">
      @if (prev(); as p) {
        <a rel="prev" [routerLink]="['/blog', p.slug]">← {{ p.title }}</a>
      }
      @if (next(); as n) {
        <a rel="next" [routerLink]="['/blog', n.slug]">{{ n.title }} →</a>
      }
    </nav>
    <section class="related" aria-labelledby="related-heading">
      <h2 id="related-heading">Related posts</h2>
      <div class="card-grid">
        @for (r of related(); track r.slug) {
          <article appPostCard [post]="r"></article>
        }
      </div>
    </section>
  `,
})
export class Post {
  // Bound from the route's resolved data (withComponentInputBinding); the body arrives as a lazy chunk.
  readonly resolved = input.required<{ slug: string; body: string }>();

  private readonly sanitizer = inject(DomSanitizer);
  protected readonly tagName = tagName;
  protected readonly post = computed(() => bySlug[this.resolved().slug]);
  // Trusted pre-rendered HTML from content/posts.json: the sanitizer would strip its class attributes.
  protected readonly body = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.resolved().body));
  protected readonly prev = computed(() => (this.post().prev ? bySlug[this.post().prev!] : null));
  protected readonly next = computed(() => (this.post().next ? bySlug[this.post().next!] : null));
  protected readonly related = computed(() => this.post().related.map((s) => bySlug[s]));

  constructor() {
    const seo = inject(Seo);
    effect(() => {
      const p = this.post();
      seo.set({ path: `/blog/${p.slug}`, title: p.title, description: p.summary, image: p.cover.src, type: 'article' });
    });
  }
}
