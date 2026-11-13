import { Link } from "@builder.io/qwik-city";
import type { CardPost } from "~/lib/types";

export const TagList = ({ tags }: { tags: CardPost["tags"] }) => (
  <ul class="tag-list">
    {tags.map((t) => (
      <li key={t.slug}>
        <Link class="tag" href={`/blog?tag=${t.slug}`}>
          {t.name}
        </Link>
      </li>
    ))}
  </ul>
);

export const PostCard = ({ post, eager = false }: { post: CardPost; eager?: boolean }) => (
  <article class="card">
    <Link class="card-link" href={`/blog/${post.slug}`}>
      <img
        class="card-image"
        src={post.thumb}
        alt=""
        width={post.thumbWidth}
        height={post.thumbHeight}
        loading={eager ? undefined : "lazy"}
        decoding="async"
      />
      <h3 class="card-title">{post.title}</h3>
    </Link>
    <p class="card-meta">
      <time dateTime={post.date}>{post.dateLabel}</time>
      {` · ${post.readingMinutes} min read`}
    </p>
    <p class="card-summary">{post.summary}</p>
    <TagList tags={post.tags} />
  </article>
);
