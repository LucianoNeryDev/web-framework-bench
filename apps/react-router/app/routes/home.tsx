import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Card } from "~/components/Card";
import { posts, toCard } from "~/lib/posts.server";
import { pageMeta, site } from "~/lib/site";

export function loader() {
  return { latest: posts.slice(0, 6).map(toCard) };
}

export const meta: Route.MetaFunction = () =>
  pageMeta({ path: "/", description: site.description, image: "/images/hero.webp" });

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>{site.heroTitle}</h1>
          <p>{site.heroText}</p>
          <p>
            <Link className="button" to="/blog">
              Read the blog
            </Link>
          </p>
        </div>
        <img
          className="hero-image"
          src="/images/hero.webp"
          alt="Abstract illustration of overlapping circles"
          width={1600}
          height={900}
          fetchPriority="high"
        />
      </section>
      <section className="latest" aria-labelledby="latest-heading">
        <h2 id="latest-heading">Latest posts</h2>
        <div className="card-grid">
          {loaderData.latest.map((p) => (
            <Card key={p.slug} post={p} />
          ))}
        </div>
        <p className="section-footer">
          <Link to="/blog">All posts →</Link>
        </p>
      </section>
    </>
  );
}
