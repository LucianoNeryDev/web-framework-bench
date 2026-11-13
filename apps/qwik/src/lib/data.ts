// Server-only: imported from routeLoader$ bodies, endpoints and onStaticGenerate, never from components.
import { posts, tags } from "../../../../content/posts.json";
import type { CardPost } from "./types";

const tagName = new Map<string, string>(tags.map((t) => [t.slug, t.name]));
const bySlug = new Map(posts.map((p) => [p.slug, p]));

type Post = (typeof posts)[number];

export const toCard = (p: Post): CardPost => ({
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  date: p.date,
  dateLabel: p.dateLabel,
  readingMinutes: p.readingMinutes,
  thumb: p.cover.thumb,
  thumbWidth: p.cover.thumbWidth,
  thumbHeight: p.cover.thumbHeight,
  tags: p.tags.map((slug) => ({ slug, name: tagName.get(slug) ?? slug })),
});

export const allPosts = posts;
export const allCards = (): CardPost[] => posts.map(toCard);
export const latestCards = (n: number): CardPost[] => posts.slice(0, n).map(toCard);

export const getPost = (slug: string) => {
  const p = bySlug.get(slug);
  if (!p) return null;
  const link = (s: string | null) => {
    const o = s ? bySlug.get(s) : undefined;
    return o ? { slug: o.slug, title: o.title } : null;
  };
  return {
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    date: p.date,
    dateLabel: p.dateLabel,
    readingMinutes: p.readingMinutes,
    html: p.html,
    cover: p.cover,
    tags: p.tags.map((slug) => ({ slug, name: tagName.get(slug) ?? slug })),
    prev: link(p.prev),
    next: link(p.next),
    related: p.related.map((s) => toCard(bySlug.get(s)!)),
  };
};
