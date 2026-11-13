import Card from "../../components/Card";
import { BlogFilter, BlogFilterFromUrl } from "../../components/BlogFilter";
import { pageMeta } from "../../lib/meta";
import { renderPerRequest } from "../../lib/dynamic";
import { IS_STATIC, posts, site, tags } from "../../lib/site";

export const metadata = pageMeta({
  path: "/blog",
  title: "Blog",
  description: `All ${posts.length} posts on ${site.title}.`,
  image: "/images/hero.webp",
});

export default async function BlogIndex({ searchParams }) {
  await renderPerRequest();
  // Only slugs, tags and a search string cross to the client; each card is rendered here.
  const items = posts.map((p, i) => ({
    slug: p.slug,
    tags: p.tags,
    search: `${p.title} ${p.summary}`.toLowerCase(),
    card: <Card post={p} eager={i < 3} />,
  }));

  let filter;
  if (IS_STATIC) {
    filter = <BlogFilterFromUrl items={items} tags={tags} />;
  } else {
    const { q, tag } = await searchParams;
    const first = (v) => (Array.isArray(v) ? v[0] : v) || "";
    filter = <BlogFilter items={items} tags={tags} initialQ={first(q)} initialTag={first(tag)} />;
  }

  return (
    <>
      <h1>Blog</h1>
      <p>Everything I have written, newest first. Search titles and summaries, or narrow by tag.</p>
      {filter}
    </>
  );
}
