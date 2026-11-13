import { RenderMode, ServerRoute } from '@angular/ssr';
import { posts } from '../generated/index';

// Static mode (swapped in by a fileReplacement in angular.json): every route is prerendered at build time.
export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => posts.map((p) => ({ slug: p.slug })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
