import { CanMatchFn, ResolveFn, Routes } from '@angular/router';
import { bodies } from '../generated/bodies';
import { bySlug } from './data';
import { Home } from './home';

const postExists: CanMatchFn = (_route, segments) => Object.hasOwn(bySlug, segments[1]?.path ?? '');

const postBody: ResolveFn<{ slug: string; body: string }> = async (route) => {
  const slug = route.paramMap.get('slug')!;
  return { slug, body: await bodies[slug]() };
};

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'blog', loadComponent: () => import('./blog').then((m) => m.Blog) },
  {
    path: 'blog/:slug',
    canMatch: [postExists],
    resolve: { resolved: postBody },
    loadComponent: () => import('./post').then((m) => m.Post),
  },
  { path: 'about', loadComponent: () => import('./about').then((m) => m.About) },
  // Prerendered to /404 so the static build can ship it as 404.html (see tools/post-static.mjs).
  { path: '404', loadComponent: () => import('./not-found').then((m) => m.NotFound) },
  { path: '**', loadComponent: () => import('./not-found').then((m) => m.NotFound) },
];
