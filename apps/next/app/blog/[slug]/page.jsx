import Link from "next/link";
import { notFound } from "next/navigation";
import Card, { TagList } from "../../../components/Card";
import { pageMeta } from "../../../lib/meta";
import { renderPerRequest } from "../../../lib/dynamic";
import { bySlug, posts } from "../../../lib/site";

// Static export: one HTML file per post, and nothing else is reachable.
export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }) {
  const post = bySlug[(await params).slug];
  if (!post) return {};
  return pageMeta({ path: `/blog/${post.slug}`, title: post.title, description: post.summary, image: post.cover.src, type: "article" });
}

export default async function Post({ params }) {
  await renderPerRequest();
  const post = bySlug[(await params).slug];
  if (!post) notFound();
  const prev = post.prev && bySlug[post.prev];
  const next = post.next && bySlug[post.next];
  return (
    <>
      <article className="post">
        <header className="post-header">
          <p className="post-meta">
            <time dateTime={post.date}>{post.dateLabel}</time>
            {` · ${post.readingMinutes} min read`}
          </p>
          <h1>{post.title}</h1>
          <p className="post-summary">{post.summary}</p>
          <TagList tags={post.tags} />
        </header>
        <img
          className="post-cover"
          src={post.cover.src}
          alt={post.cover.alt}
          width={post.cover.width}
          height={post.cover.height}
          fetchPriority="high"
        />
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <nav className="post-nav" aria-label="Adjacent posts">
        {prev && <Link rel="prev" href={`/blog/${prev.slug}`}>{`← ${prev.title}`}</Link>}
        {next && <Link rel="next" href={`/blog/${next.slug}`}>{`${next.title} →`}</Link>}
      </nav>
      <section className="related" aria-labelledby="related-heading">
        <h2 id="related-heading">Related posts</h2>
        <div className="card-grid">
          {post.related.map((s) => (
            <Card key={s} post={bySlug[s]} />
          ))}
        </div>
      </section>
    </>
  );
}
