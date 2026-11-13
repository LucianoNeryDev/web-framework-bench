import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("blog", "routes/blog.tsx"),
  route("blog/:slug", "routes/post.tsx"),
  route("about", "routes/about.tsx"),
  route("rss.xml", "routes/rss.ts"),
  route("sitemap.xml", "routes/sitemap.ts"),
  // /healthz is answered by nginx in static mode; the server build answers it here.
  ...(process.env.WFB_MODE === "static" ? [] : [route("healthz", "routes/healthz.ts")]),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
