import { Link } from "react-router";
import { tagName } from "~/lib/site";
import type { Card as CardData } from "~/lib/posts.server";

export function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="tag-list">
      {tags.map((t) => (
        <li key={t}>
          <Link className="tag" to={`/blog?tag=${t}`}>
            {tagName(t)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Card({ post, eager = false }: { post: CardData; eager?: boolean }) {
  return (
    <article className="card">
      <Link className="card-link" to={`/blog/${post.slug}`}>
        <img
          className="card-image"
          src={post.thumb}
          alt=""
          width={post.thumbWidth}
          height={post.thumbHeight}
          loading={eager ? undefined : "lazy"}
          decoding="async"
        />
        <h3 className="card-title">{post.title}</h3>
      </Link>
      <p className="card-meta">
        <time dateTime={post.date}>{post.dateLabel}</time>
        {` · ${post.readingMinutes} min read`}
      </p>
      <p className="card-summary">{post.summary}</p>
      <TagList tags={post.tags} />
    </article>
  );
}
