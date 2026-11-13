// Every measured configuration. A target is one app in one mode.
//
//   image:   a single container from wfb/<app>:<mode>, optionally with env
//   compose: a multi-container app; `entry` is the service that listens on 8080 and is published on WFB_PORT,
//            `app` is the service that runs the application code (killed in the crash test), `db` the database.
//
// `server: true` means the target renders ?q=&tag= on the server, so conformance runs with --server.
const image = (id, app, mode, label, extra = {}) => ({
  id, app, mode, label,
  kind: "image",
  image: `wfb/${app}:${mode === "cached" ? "server" : mode}`,
  dockerfile: `apps/${app}/Dockerfile`,
  buildTarget: mode,
  server: mode !== "static",
  env: {},
  ...extra,
});

export const targets = [
  image("static-html", "static-html", "static", "HTML + nginx", { buildTarget: null }),
  image("hugo", "hugo", "static", "Hugo"),

  image("nuxt-static", "nuxt", "static", "Nuxt (SSG)"),
  image("nuxt-server", "nuxt", "server", "Nuxt (SSR)"),
  image("next-static", "next", "static", "Next.js (export)"),
  image("next-server", "next", "server", "Next.js (SSR)"),
  image("astro-static", "astro", "static", "Astro (SSG)"),
  image("astro-server", "astro", "server", "Astro (SSR)"),
  image("sveltekit-static", "sveltekit", "static", "SvelteKit (SSG)"),
  image("sveltekit-server", "sveltekit", "server", "SvelteKit (SSR)"),
  image("react-router-static", "react-router", "static", "React Router (prerender)"),
  image("react-router-server", "react-router", "server", "React Router (SSR)"),
  image("angular-static", "angular", "static", "Angular (prerender)"),
  image("angular-server", "angular", "server", "Angular (SSR)"),
  image("qwik-static", "qwik", "static", "Qwik City (SSG)"),
  image("qwik-server", "qwik", "server", "Qwik City (SSR)"),

  image("go", "go", "server", "Go net/http", { env: { WFB_INTERACTIVITY: "vanilla" } }),
  image("go-htmx", "go", "server", "Go + htmx", { env: { WFB_INTERACTIVITY: "htmx" }, buildShared: "go" }),

  // Multi-container targets; filled in from each app's compose.yaml once implemented.
  {
    id: "laravel", app: "laravel", mode: "server", label: "Laravel (PHP-FPM)", kind: "compose", server: true,
    compose: "apps/laravel/compose.yaml", env: {}, entry: "nginx", appService: "app", db: null,
  },
  {
    id: "wordpress", app: "wordpress", mode: "server", label: "WordPress", kind: "compose", server: true,
    compose: "apps/wordpress/compose.yaml", env: { WFB_CACHE: "off" }, entry: "nginx", appService: "wordpress", db: "db",
  },
  {
    id: "wordpress-cached", app: "wordpress", mode: "cached", label: "WordPress (page cache)", kind: "compose", server: true,
    compose: "apps/wordpress/compose.yaml", env: { WFB_CACHE: "on" }, entry: "nginx", appService: "wordpress", db: "db", buildShared: "wordpress",
  },
  {
    id: "ghost", app: "ghost", mode: "server", label: "Ghost", kind: "compose", server: false,
    compose: "apps/ghost/compose.yaml", env: { WFB_CACHE: "off" }, entry: "nginx", appService: "ghost", db: "db",
  },
  {
    id: "ghost-cached", app: "ghost", mode: "cached", label: "Ghost (proxy cache)", kind: "compose", server: false,
    compose: "apps/ghost/compose.yaml", env: { WFB_CACHE: "on" }, entry: "nginx", appService: "ghost", db: "db", buildShared: "ghost",
  },
];

export const byId = Object.fromEntries(targets.map((t) => [t.id, t]));

export function select(ids) {
  if (!ids.length || ids.includes("all")) return targets;
  return ids.map((id) => {
    const found = byId[id] ?? targets.filter((t) => t.app === id);
    if (!found || (Array.isArray(found) && !found.length)) throw new Error(`unknown target ${id}`);
    return found;
  }).flat();
}
