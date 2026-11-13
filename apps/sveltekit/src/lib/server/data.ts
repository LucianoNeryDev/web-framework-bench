import type { CardData, Dataset, Post } from "#lib/types.ts";
import raw from "../../../../../content/posts.json";

const data = raw as Dataset;

export const { site, tags, posts } = data;

const bySlug = new Map(posts.map((p) => [p.slug, p]));
const tagByslug = new Map(tags.map((t) => [t.slug, t]));

export const getPost = (slug: string): Post | undefined => bySlug.get(slug);

export const toCard = (p: Post): CardData => ({
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  date: p.date,
  dateLabel: p.dateLabel,
  readingMinutes: p.readingMinutes,
  thumb: p.cover.thumb,
  thumbWidth: p.cover.thumbWidth,
  thumbHeight: p.cover.thumbHeight,
  tags: p.tags.map((t) => tagByslug.get(t)!),
});

export const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
