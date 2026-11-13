import data from "~/data/posts.json";

export const { site, tags, posts } = data;

const bySlug = new Map(posts.map((p) => [p.slug, p]));

export type Card = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  dateLabel: string;
  readingMinutes: number;
  tags: string[];
  thumb: string;
  thumbWidth: number;
  thumbHeight: number;
};

type Post = (typeof posts)[number];

export function toCard(p: Post): Card {
  return {
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    date: p.date,
    dateLabel: p.dateLabel,
    readingMinutes: p.readingMinutes,
    tags: p.tags,
    thumb: p.cover.thumb,
    thumbWidth: p.cover.thumbWidth,
    thumbHeight: p.cover.thumbHeight,
  };
}

export const getPost = (slug: string) => bySlug.get(slug);
export const getCard = (slug: string) => toCard(bySlug.get(slug)!);
