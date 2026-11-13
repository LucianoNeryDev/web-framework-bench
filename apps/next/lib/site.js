import data from "../data/posts.json";

export const { site, tags, posts } = data;
export const IS_STATIC = process.env.WFB_MODE === "static";
export const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));
export const tagName = Object.fromEntries(tags.map((t) => [t.slug, t.name]));

export function filterPosts(q, tag) {
  const needle = (q || "").trim().toLowerCase();
  return posts.filter(
    (p) => (!tag || p.tags.includes(tag)) && (!needle || `${p.title} ${p.summary}`.toLowerCase().includes(needle)),
  );
}
