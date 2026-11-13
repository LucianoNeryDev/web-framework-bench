import { readFileSync } from "node:fs";

// WFB_MODE is read at build time: "static" exports HTML for nginx, "server" builds the standalone Node server.
const mode = process.env.WFB_MODE === "server" ? "server" : "static";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: mode === "static" ? "export" : "standalone",
  // Inlined into the bundles so server.js needs no runtime env.
  env: { WFB_MODE: mode },
  poweredByHeader: false,
};

if (mode === "server") {
  // A dynamic page that calls notFound() answers 404 with an empty HTML shell (id="__next_error__") and lets the
  // browser render not-found.jsx. Only routes that match nothing get Next's complete server-rendered 404 page, so
  // /blog/<unknown> is rewritten to a route that does not exist. Known slugs never match the negative lookahead.
  const { posts } = JSON.parse(readFileSync("data/posts.json", "utf8"));
  const known = posts.map((p) => p.slug).join("|");
  nextConfig.rewrites = async () => ({
    beforeFiles: [{ source: `/blog/:slug((?!(?:${known})$).+)`, destination: "/blog-post-not-found" }],
  });
}

export default nextConfig;
