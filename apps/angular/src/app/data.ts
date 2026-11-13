import { posts, site, tags } from '../generated/index';
import { PostMeta } from './models';

export { posts, site, tags };
export const bySlug: Record<string, PostMeta> = Object.fromEntries(posts.map((p) => [p.slug, p]));
export const tagName: Record<string, string> = Object.fromEntries(tags.map((t) => [t.slug, t.name]));
