import Link from "next/link";
import Card from "../../components/Card";
import { pageMeta } from "../../lib/meta";
import { renderPerRequest } from "../../lib/dynamic";
import { posts, site } from "../../lib/site";

export const metadata = pageMeta({ path: "/", title: site.title, description: site.description, image: "/images/hero.webp" });

export default async function Home() {
  await renderPerRequest();
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>{site.heroTitle}</h1>
          <p>{site.heroText}</p>
          <p><Link className="button" href="/blog">Read the blog</Link></p>
        </div>
        <img
          className="hero-image"
          src="/images/hero.webp"
          alt="Abstract illustration of overlapping circles"
          width="1600"
          height="900"
          fetchPriority="high"
        />
      </section>
      <section className="latest" aria-labelledby="latest-heading">
        <h2 id="latest-heading">Latest posts</h2>
        <div className="card-grid">
          {posts.slice(0, 6).map((p) => (
            <Card key={p.slug} post={p} />
          ))}
        </div>
        <p className="section-footer"><Link href="/blog">All posts →</Link></p>
      </section>
    </>
  );
}
