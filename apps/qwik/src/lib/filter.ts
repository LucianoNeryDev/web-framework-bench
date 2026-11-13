import type { CardPost } from "./types";

/** A post matches when the tag is among its tags and the query is a substring of title + " " + summary. */
export const filterPosts = (posts: CardPost[], q: string, tag: string): CardPost[] => {
  const needle = q.trim().toLowerCase();
  return posts.filter(
    (p) =>
      (!tag || p.tags.some((t) => t.slug === tag)) &&
      (!needle || `${p.title} ${p.summary}`.toLowerCase().includes(needle)),
  );
};
