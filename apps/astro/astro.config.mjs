import { defineConfig } from "astro/config";
import node from "@astrojs/node";

// WFB_MODE=static (default) prerenders every page; WFB_MODE=server renders every page per request.
const server = process.env.WFB_MODE === "server";

export default defineConfig({
  site: "https://bench.example",
  output: server ? "server" : "static",
  adapter: server ? node({ mode: "standalone" }) : undefined,
  // /blog -> blog.html and /blog/<slug> -> blog/<slug>.html, which static.conf resolves without redirects.
  build: { format: "file" },
  devToolbar: { enabled: false },
});
