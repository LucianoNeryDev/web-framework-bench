import { error } from "@sveltejs/kit";
import { getPost, posts, toCard } from "#lib/server/data.ts";

export const entries = () => posts.map((p) => ({ slug: p.slug }));

const link = (slug: string | null) => {
  const p = slug ? getPost(slug) : undefined;
  return p ? { slug: p.slug, title: p.title } : null;
};

export const load = ({ params }) => {
  const post = getPost(params.slug);
  if (!post) error(404, "Not found");
  return {
    post: {
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      date: post.date,
      dateLabel: post.dateLabel,
      readingMinutes: post.readingMinutes,
      cover: post.cover,
      html: post.html,
    },
    tags: toCard(post).tags,
    prev: link(post.prev),
    next: link(post.next),
    related: post.related.map((s) => toCard(getPost(s)!)),
  };
};
