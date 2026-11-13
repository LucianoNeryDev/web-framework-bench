import Link from "next/link";
import Shell from "../components/Shell";
import { pageMeta } from "../lib/meta";

export const metadata = pageMeta({
  path: "/404",
  title: "Page not found",
  description: "This page does not exist.",
  image: "/images/hero.webp",
});

export default function NotFound() {
  return (
    <Shell>
      <section className="not-found">
        <h1>Page not found</h1>
        <p>The page you asked for does not exist or has moved.</p>
        <p><Link className="button" href="/">Back to the home page</Link></p>
      </section>
    </Shell>
  );
}
