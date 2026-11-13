import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { PostCard } from "~/components/post-card";
import { latestCards } from "~/lib/data";
import { pageHead } from "~/lib/head";
import { site } from "~/lib/site";

export const useLatest = routeLoader$(() => latestCards(6));

export default component$(() => {
  const latest = useLatest();
  return (
    <>
      <section class="hero">
        <div class="hero-text">
          <h1>{site.heroTitle}</h1>
          <p>{site.heroText}</p>
          <p>
            <Link class="button" href="/blog">
              Read the blog
            </Link>
          </p>
        </div>
        <img
          class="hero-image"
          src="/images/hero.webp"
          alt="Abstract illustration of overlapping circles"
          width={1600}
          height={900}
          fetchPriority="high"
        />
      </section>
      <section class="latest" aria-labelledby="latest-heading">
        <h2 id="latest-heading">Latest posts</h2>
        <div class="card-grid">
          {latest.value.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
        <p class="section-footer">
          <Link href="/blog">All posts →</Link>
        </p>
      </section>
    </>
  );
});

export const head: DocumentHead = pageHead({
  path: "/",
  title: site.title,
  description: site.description,
  image: "/images/hero.webp",
});
