import { readFileSync } from "node:fs";
import type { Config } from "@react-router/dev/config";

// WFB_MODE=static  pre-renders every route at build time (SPA-less, no server needed)
// WFB_MODE=server  server-side renders every request, nothing is pre-rendered
const mode = process.env.WFB_MODE === "static" ? "static" : "server";

export default {
  ssr: mode === "server",
  prerender: mode === "static" ? prerenderPaths : false,
} satisfies Config;

async function prerenderPaths() {
  const { posts } = JSON.parse(readFileSync("app/data/posts.json", "utf8"));
  return [
    "/",
    "/blog",
    "/about",
    "/404",
    "/rss.xml",
    "/sitemap.xml",
    ...posts.map((p: { slug: string }) => `/blog/${p.slug}`),
  ];
}
