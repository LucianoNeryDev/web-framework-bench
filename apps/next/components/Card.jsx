import Link from "next/link";
import { tagName } from "../lib/site";

export function TagList({ tags }) {
  return (
    <ul className="tag-list">
      {tags.map((t) => (
        <li key={t}>
          <Link className="tag" href={`/blog?tag=${t}`}>{tagName[t]}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Card({ post, eager = false }) {
  return (
    <article className="card">
      <Link className="card-link" href={`/blog/${post.slug}`}>
        <img
          className="card-image"
          src={post.cover.thumb}
          alt=""
          width={post.cover.thumbWidth}
          height={post.cover.thumbHeight}
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
