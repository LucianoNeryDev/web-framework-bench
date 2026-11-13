import { Link, data } from "react-router";
import type { Route } from "./+types/post";
import { Card, TagList } from "~/components/Card";
import { getCard, getPost } from "~/lib/posts.server";
import { pageMeta } from "~/lib/site";

export function loader({ params }: Route.LoaderArgs) {
  const post = getPost(params.slug);
  if (!post) throw data(null, { status: 404 });
  const neighbour = (slug: string | null) => (slug ? { slug, title: getPost(slug)!.title } : null);
  return {
    post: {
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      date: post.date,
      dateLabel: post.dateLabel,
      readingMinutes: post.readingMinutes,
      tags: post.tags,
      cover: post.cover,
      html: post.html,
    },
    prev: neighbour(post.prev),
    next: neighbour(post.next),
    related: post.related.map(getCard),
  };
}

export const meta: Route.MetaFunction = ({ loaderData }) =>
  loaderData
    ? pageMeta({
        path: `/blog/${loaderData.post.slug}`,
        title: loaderData.post.title,
        description: loaderData.post.summary,
        image: loaderData.post.cover.src,
        type: "article",
      })
    : [];

export default function Post({ loaderData }: Route.ComponentProps) {
  const { post, prev, next, related } = loaderData;
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
        {prev && (
          <Link rel="prev" to={`/blog/${prev.slug}`}>
            {`← ${prev.title}`}
          </Link>
        )}
        {next && (
          <Link rel="next" to={`/blog/${next.slug}`}>
            {`${next.title} →`}
          </Link>
        )}
      </nav>
      <section className="related" aria-labelledby="related-heading">
        <h2 id="related-heading">Related posts</h2>
        <div className="card-grid">
          {related.map((p) => (
            <Card key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </>
  );
}
