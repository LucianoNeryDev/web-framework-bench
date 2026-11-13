import data from "../data/posts.json";

export const { site, tags, posts } = data;
export type Post = (typeof posts)[number];

export const bySlug: Record<string, Post> = Object.fromEntries(posts.map((p) => [p.slug, p]));
export const tagName: Record<string, string> = Object.fromEntries(tags.map((t) => [t.slug, t.name]));

export const THEME_SCRIPT =
  '<script>try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t;' +
  'else if(matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.dataset.theme="dark"}catch(e){}</script>';

export function matches(post: Post, q: string, tag: string): boolean {
  const needle = q.trim().toLowerCase();
  return (!tag || post.tags.includes(tag)) && (!needle || `${post.title} ${post.summary}`.toLowerCase().includes(needle));
}
