import { Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, Link } from "react-router";
import type { Route } from "./+types/root";
import { NotFound } from "./components/NotFound";
import { ThemeToggle } from "./components/ThemeToggle";
import { site } from "./lib/site";

// Inline in <head>, byte for byte the contract's snippet (without the <script> tags).
const THEME_SCRIPT =
  'try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t;' +
  'else if(matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.dataset.theme="dark"}catch(e){}';

export const links: Route.LinksFunction = () => [
  { rel: "alternate", type: "application/rss+xml", title: site.title, href: "/rss.xml" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "stylesheet", href: "/style.css" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <Links />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="container">
            <Link className="brand" to="/">
              {site.title}
            </Link>
            <nav className="site-nav" aria-label="Main">
              <NavLink to="/" end>
                Home
              </NavLink>
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/about">About</NavLink>
            </nav>
            <ThemeToggle />
          </div>
        </header>
        <main id="main" className="container">
          {children}
        </main>
        <footer className="site-footer">
          <div className="container">
            <p>
              {`© 2026 ${site.author} · `}
              <a href="/rss.xml">RSS</a>
            </p>
          </div>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound withHead />;
  return (
    <section className="not-found">
      <title>Error</title>
      <h1>Something went wrong</h1>
      <p>{error instanceof Error ? error.message : "Unexpected error."}</p>
    </section>
  );
}
