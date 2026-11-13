import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { site } from "../lib/site";

const NAV = [
  ["/", "Home"],
  ["/blog", "Blog"],
  ["/about", "About"],
];

export default function Shell({ current, children }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="container">
          <Link className="brand" href="/">{site.title}</Link>
          <nav className="site-nav" aria-label="Main">
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} aria-current={current === href ? "page" : undefined}>{label}</Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main id="main" className="container">
        {children}
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>{`© 2026 ${site.author} · `}<a href="/rss.xml">RSS</a></p>
        </div>
      </footer>
    </>
  );
}
