import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, type DocumentHead, type StaticGenerateHandler } from "@builder.io/qwik-city";
import { NotFound } from "~/components/not-found";
import { PostCard, TagList } from "~/components/post-card";
import { allPosts, getPost } from "~/lib/data";
import { pageHead } from "~/lib/head";

export const usePost = routeLoader$(({ params, status }) => {
  const post = getPost(params.slug);
  if (!post) status(404);
  return post;
});

export const onStaticGenerate: StaticGenerateHandler = () => ({
  params: allPosts.map((p) => ({ slug: p.slug })),
});

export default component$(() => {
  const loaded = usePost();
  const data = loaded.value;
  if (!data) return <NotFound />;
  const { prev, next } = data;
  return (
    <>
      <article class="post">
        <header class="post-header">
          <p class="post-meta">
            <time dateTime={data.date}>{data.dateLabel}</time>
            {` · ${data.readingMinutes} min read`}
          </p>
          <h1>{data.title}</h1>
          <p class="post-summary">{data.summary}</p>
          <TagList tags={data.tags} />
        </header>
        <img
          class="post-cover"
          src={data.cover.src}
          alt={data.cover.alt}
          width={data.cover.width}
          height={data.cover.height}
          fetchPriority="high"
        />
        <div class="post-body" dangerouslySetInnerHTML={data.html} />
      </article>
      <nav class="post-nav" aria-label="Adjacent posts">
        {prev && (
          <Link rel="prev" href={`/blog/${prev.slug}`}>
            {`← ${prev.title}`}
          </Link>
        )}
        {next && (
          <Link rel="next" href={`/blog/${next.slug}`}>
            {`${next.title} →`}
          </Link>
        )}
      </nav>
      <section class="related" aria-labelledby="related-heading">
        <h2 id="related-heading">Related posts</h2>
        <div class="card-grid">
          {data.related.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue, params }) => {
  const post = resolveValue(usePost);
  if (!post) {
    return pageHead({
      path: `/blog/${params.slug}`,
      title: "Page not found",
      description: "This page does not exist.",
      image: "/images/hero.webp",
    });
  }
  return pageHead({
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.summary,
    image: post.cover.src,
    type: "article",
  });
};
