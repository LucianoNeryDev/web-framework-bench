import { Link } from "react-router";
import { pageMeta } from "~/lib/site";

export const notFoundMeta = () =>
  pageMeta({ path: "/404", title: "Page not found", description: "This page does not exist.", image: "/images/hero.webp" });

// `withHead` is for the error boundary, where no route `meta` export applies:
// React 19 hoists <title>, <meta> and <link> into <head>.
export function NotFound({ withHead = false }: { withHead?: boolean }) {
  const head = withHead ? notFoundMeta() : [];
  return (
    <section className="not-found">
      {head.map((m, i) =>
        "title" in m ? (
          <title key={i}>{m.title}</title>
        ) : "tagName" in m ? (
          <link key={i} rel="canonical" href={m.href} />
        ) : (
          <meta key={i} {...m} />
        ),
      )}
      <h1>Page not found</h1>
      <p>The page you asked for does not exist or has moved.</p>
      <p>
        <Link className="button" to="/">
          Back to the home page
        </Link>
      </p>
    </section>
  );
}
