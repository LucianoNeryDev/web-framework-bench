import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { tagName } from './data';
import { PostMeta } from './models';

@Component({
  selector: 'article[appPostCard]',
  imports: [RouterLink],
  host: { class: 'card' },
  template: `
    <a class="card-link" [routerLink]="['/blog', post().slug]"
      ><img
        class="card-image"
        [src]="post().cover.thumb"
        alt=""
        [attr.width]="post().cover.thumbWidth"
        [attr.height]="post().cover.thumbHeight"
        [attr.loading]="eager() ? null : 'lazy'"
        decoding="async"
      /><h3 class="card-title">{{ post().title }}</h3></a
    >
    <p class="card-meta"><time [attr.datetime]="post().date">{{ post().dateLabel }}</time> · {{ post().readingMinutes }} min read</p>
    <p class="card-summary">{{ post().summary }}</p>
    <ul class="tag-list">
      @for (t of post().tags; track t) {
        <li><a class="tag" routerLink="/blog" [queryParams]="{ tag: t }">{{ tagName[t] }}</a></li>
      }
    </ul>
  `,
})
export class PostCard {
  readonly post = input.required<PostMeta>();
  readonly eager = input(false);
  protected readonly tagName = tagName;
}
