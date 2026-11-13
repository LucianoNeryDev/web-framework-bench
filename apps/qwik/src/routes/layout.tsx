import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { ThemeToggle } from "~/components/theme-toggle";
import { site } from "~/lib/site";

const NAV = [
  ["/", "Home"],
  ["/blog", "Blog"],
  ["/about", "About"],
] as const;

export default component$(() => {
  const path = useLocation().url.pathname.replace(/\/+$/, "") || "/";
  const current = path === "/" ? "/" : path.startsWith("/blog") ? "/blog" : path.startsWith("/about") ? "/about" : "";
  return (
    <>
      <a class="skip-link" href="#main">
        Skip to content
      </a>
      <header class="site-header">
        <div class="container">
          <Link class="brand" href="/">
            {site.title}
          </Link>
          <nav class="site-nav" aria-label="Main">
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} aria-current={current === href ? "page" : undefined}>
                {label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main id="main" class="container">
        <Slot />
      </main>
      <footer class="site-footer">
        <div class="container">
          <p>
            {`© 2026 ${site.author} · `}
            <a href="/rss.xml">RSS</a>
          </p>
        </div>
      </footer>
    </>
  );
});
