import { Component, RESPONSE_INIT, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from './seo';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="not-found">
      <h1>Page not found</h1>
      <p>The page you asked for does not exist or has moved.</p>
      <p><a class="button" routerLink="/">Back to the home page</a></p>
    </section>
  `,
})
export class NotFound {
  constructor() {
    // Set only while rendering on the server (and prerendering): the response gets a real 404 status.
    const response = inject(RESPONSE_INIT, { optional: true });
    if (response) response.status = 404;
    inject(Seo).set({
      path: '/404',
      title: 'Page not found',
      description: 'This page does not exist.',
      image: '/images/hero.webp',
    });
  }
}
