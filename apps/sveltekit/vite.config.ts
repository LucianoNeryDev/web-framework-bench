import adapterNode from "@sveltejs/adapter-node";
import adapterStatic from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// WFB_MODE=static (default): everything prerendered, served by nginx.
// WFB_MODE=server: every page rendered per request by `node build`.
const staticMode = process.env.WFB_MODE !== "server";
const content = fileURLToPath(new URL("../../content", import.meta.url));

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: staticMode ? adapterStatic({ pages: "build", assets: "build", strict: true }) : adapterNode(),
      // Absolute /_app/... URLs: the one 404.html is served for unknown paths at any depth.
      paths: { relative: false },
      prerender: {
        // Pages are found by crawling; these two are not linked from any page.
        entries: ["*", "/404", "/sitemap.xml"],
      },
    }),
  ],
  define: { __WFB_STATIC__: JSON.stringify(staticMode) },
  // content/posts.json lives at the repository root, outside this app.
  server: { fs: { allow: [content] } },
});
