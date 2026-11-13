import { isPlatformServer } from '@angular/common';
import { Component, PLATFORM_ID, DestroyRef, afterNextRender, computed, inject, makeStateKey, signal, TransferState } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { posts, site, tags } from './data';
import { PostCard } from './post-card';
import { Seo } from './seo';

interface Filters {
  q: string;
  tag: string;
}

// What the server rendered, so hydration starts from the same state. A prerendered page always carries the
// unfiltered list; the browser then applies the URL's query after hydration.
const RENDERED = makeStateKey<Filters>('blog-filters');

@Component({
  selector: 'app-blog',
  imports: [PostCard],
  template: `
    <h1>Blog</h1>
    <p>Everything I have written, newest first. Search titles and summaries, or narrow by tag.</p>
    <form class="filters" role="search" action="/blog" method="get" (submit)="$event.preventDefault()">
      <label for="q">Search posts</label>
      <input
        id="q"
        name="q"
        type="search"
        placeholder="Search titles and summaries"
        autocomplete="off"
        [attr.value]="q() || null"
        [value]="q()"
        (input)="setQuery($event)"
      />
      <div class="tag-filter" role="group" aria-label="Filter by tag">
        <button type="button" class="chip" [attr.aria-pressed]="tag() === ''" (click)="setTag('')">All</button>
        @for (t of tags; track t.slug) {
          <button type="button" class="chip" [attr.aria-pressed]="tag() === t.slug" (click)="setTag(t.slug)">{{ t.name }}</button>
        }
      </div>
    </form>
    <h2 class="visually-hidden">Posts</h2>
    <p class="result-count" aria-live="polite">Showing {{ filtered().length }} of {{ total }} posts</p>
    <div class="card-grid" data-post-list>
      @for (p of filtered(); track p.slug; let i = $index) {
        <article appPostCard [post]="p" [eager]="i < 3"></article>
      }
    </div>
    <p class="empty" [attr.hidden]="filtered().length ? '' : null">No posts match.</p>
  `,
})
export class Blog {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly state = inject(TransferState);

  protected readonly tags = tags;
  protected readonly total = posts.length;
  protected readonly q = signal('');
  protected readonly tag = signal('');
  protected readonly filtered = computed(() => {
    const q = this.q().toLowerCase();
    const tag = this.tag();
    return posts.filter((p) => (!tag || p.tags.includes(tag)) && (!q || `${p.title} ${p.summary}`.toLowerCase().includes(q)));
  });

  constructor() {
    inject(Seo).set({
      path: '/blog',
      title: 'Blog',
      description: `All ${posts.length} posts on ${site.title}.`,
      image: '/images/hero.webp',
    });

    if (isPlatformServer(inject(PLATFORM_ID))) {
      // Server render: apply ?q= and ?tag= right away so the HTML arrives already filtered.
      const query = this.route.snapshot.queryParamMap;
      this.apply(query.get('q') ?? '', query.get('tag') ?? '');
      this.state.set(RENDERED, { q: this.q(), tag: this.tag() });
    } else {
      const rendered = this.state.get(RENDERED, { q: '', tag: '' });
      this.apply(rendered.q, rendered.tag);
      const destroyRef = inject(DestroyRef);
      afterNextRender(() => {
        // Emits the current URL query first (the static case), then any later navigation to /blog?tag=...
        this.route.queryParamMap.pipe(takeUntilDestroyed(destroyRef)).subscribe((query) => {
          this.apply(query.get('q') ?? '', query.get('tag') ?? '');
        });
      });
    }
  }

  private apply(q: string, tag: string): void {
    this.q.set(q);
    this.tag.set(tags.some((t) => t.slug === tag) ? tag : '');
  }

  protected setQuery(event: Event): void {
    this.q.set((event.target as HTMLInputElement).value);
    this.syncUrl();
  }

  protected setTag(tag: string): void {
    this.tag.set(tag);
    this.syncUrl();
  }

  private syncUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.q() || null, tag: this.tag() || null },
      replaceUrl: true,
    });
  }
}
