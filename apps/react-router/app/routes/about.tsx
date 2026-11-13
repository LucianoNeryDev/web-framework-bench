import type { Route } from "./+types/about";
import { pageMeta, site } from "~/lib/site";

export const meta: Route.MetaFunction = () =>
  pageMeta({ path: "/about", title: "About", description: `About ${site.author} and ${site.title}.`, image: "/images/avatar.webp" });

export default function About() {
  return (
    <section className="about">
      <h1>About</h1>
      <img className="about-avatar" src="/images/avatar.webp" alt={`Portrait of ${site.author}`} width={160} height={160} />
      <div dangerouslySetInnerHTML={{ __html: site.aboutHtml }} />
    </section>
  );
}
