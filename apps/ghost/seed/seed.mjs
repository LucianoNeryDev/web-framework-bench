// One-shot seeding for the Ghost target, run by the compose `seed` service on every `up`.
//
// Idempotent: completes Ghost's owner setup once, then brings tags, posts, the About page, settings and the active
// theme in line with content/posts.json, creating only what is missing and removing Ghost's fixture content.
// It talks to the Admin API directly (http://ghost:2368) with a staff session, as Ghost Admin itself does.
import { readFileSync } from "node:fs";

const GHOST = process.env.GHOST_INTERNAL_URL || "http://ghost:2368";
const ORIGIN = process.env.GHOST_ADMIN_ORIGIN || "https://bench.example";
const EMAIL = process.env.GHOST_OWNER_EMAIL || "ada@bench.example";
const PASSWORD = process.env.GHOST_OWNER_PASSWORD || "field-notes-bench-2026";
const THEME = process.env.GHOST_THEME || "fieldnotes";
const DATA = process.env.POSTS_JSON || "/opt/fieldnotes/posts.json";

const { site, tags, posts } = JSON.parse(readFileSync(DATA, "utf8"));
const API = `${GHOST}/ghost/api/admin`;
let cookie = "";

async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    redirect: "manual",
    headers: {
      // TLS ends in front of Ghost; the session cookie and Ghost's SSL redirect both need to see https.
      "X-Forwarded-Proto": "https",
      Origin: ORIGIN,
      "Accept-Version": "v6.0",
      ...(body && { "Content-Type": "application/json" }),
      ...(cookie && { Cookie: cookie }),
    },
    body: body && JSON.stringify(body),
  });
  const text = await res.text();
  if (res.status >= 300) throw new Error(`${method} ${path}: ${res.status} ${text.slice(0, 500)}`);
  const setCookie = res.headers.getSetCookie?.() ?? [];
  const session = setCookie.find((c) => c.startsWith("ghost-admin-api-session="));
  if (session) cookie = session.split(";")[0];
  return res.headers.get("content-type")?.includes("json") ? JSON.parse(text) : {};
}

async function waitForGhost() {
  for (let i = 0; i < 180; i++) {
    try {
      return await api("GET", "/authentication/setup/");
    } catch (e) {
      if (i % 10 === 0) console.log(`waiting for Ghost: ${e.message}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("Ghost did not answer");
}

async function browseAll(resource, query = "") {
  const items = [];
  for (let page = 1; ; page++) {
    const r = await api("GET", `/${resource}/?limit=100&page=${page}${query}`);
    items.push(...r[resource]);
    if (!r.meta?.pagination?.next) return items;
  }
}

const setup = await waitForGhost();
if (!setup.setup?.[0]?.status) {
  await api("POST", "/authentication/setup/", {
    setup: [{ name: site.author, email: EMAIL, password: PASSWORD, blogTitle: site.title }],
  });
  console.log("owner setup done");
}
await api("POST", "/session/", { username: EMAIL, password: PASSWORD });
if (!cookie) throw new Error("no session cookie after sign-in");

await api("PUT", "/settings/", {
  settings: [
    { key: "title", value: site.title },
    { key: "description", value: site.description },
    { key: "timezone", value: "Etc/UTC" },
    { key: "locale", value: "en" },
    { key: "members_signup_access", value: "none" },
    // No outbound services: Ghost's Explore directory ping and the hosted ActivityPub (social web) service.
    { key: "explore_ping", value: false },
    { key: "social_web", value: false },
  ],
});

// Tags, in the dataset's order. Ghost's fixture tag ("News") goes.
const tagSlugs = new Set(tags.map((t) => t.slug));
let existingTags = await browseAll("tags", "&filter=visibility:[public,internal]");
for (const t of existingTags.filter((t) => !tagSlugs.has(t.slug))) await api("DELETE", `/tags/${t.id}/`);
const haveTags = new Set(existingTags.map((t) => t.slug));
let createdTags = 0;
for (const t of tags) {
  if (haveTags.has(t.slug)) continue;
  await api("POST", "/tags/", { tags: [{ name: t.name, slug: t.slug }] });
  createdTags++;
}

// Posts. Ghost's fixture post ("Coming soon") goes; missing posts are created from HTML (converted to Lexical).
const postSlugs = new Set(posts.map((p) => p.slug));
const existingPosts = await browseAll("posts", "&fields=id,slug");
for (const p of existingPosts.filter((p) => !postSlugs.has(p.slug))) await api("DELETE", `/posts/${p.id}/`);
const havePosts = new Set(existingPosts.map((p) => p.slug));
const tagName = Object.fromEntries(tags.map((t) => [t.slug, t.name]));
let createdPosts = 0;
// Oldest first, so created_at follows published_at like a real archive.
for (const p of [...posts].reverse()) {
  if (havePosts.has(p.slug)) continue;
  await api("POST", "/posts/?source=html", {
    posts: [{
      title: p.title,
      slug: p.slug,
      html: p.html,
      custom_excerpt: p.summary,
      status: "published",
      published_at: `${p.date}T00:00:00.000Z`,
      tags: p.tags.map((slug) => ({ slug, name: tagName[slug] })),
      feature_image: p.cover.src,
      feature_image_alt: p.cover.alt,
    }],
  });
  createdPosts++;
}

// The About page. Ghost's fixtures already have a page with the slug "about" ("About this site"); replace it.
const aboutDescription = `About ${site.author} and ${site.title}.`;
const [about] = (await api("GET", "/pages/?filter=slug:about&limit=1")).pages;
const aboutPage = { title: "About", slug: "about", html: site.aboutHtml, custom_excerpt: aboutDescription, status: "published" };
if (!about) {
  await api("POST", "/pages/?source=html", { pages: [aboutPage] });
  console.log("about page created");
} else if (about.title !== "About" || about.custom_excerpt !== aboutDescription) {
  await api("PUT", `/pages/${about.id}/?source=html`, { pages: [{ ...aboutPage, updated_at: about.updated_at }] });
  console.log("about page updated");
}
for (const page of await browseAll("pages", "&fields=id,slug")) {
  if (page.slug !== "about") await api("DELETE", `/pages/${page.id}/`);
}

const activated = await api("PUT", `/themes/${THEME}/activate/`);
const theme = activated.themes?.[0];
if (!theme?.active) throw new Error(`theme ${THEME} not active: ${JSON.stringify(activated).slice(0, 500)}`);
// GScan findings that are not fatal (Koenig card classes, {{ghost_head}}, ...): listed, not acted on.
const codes = (list) => [...new Set((list ?? []).map((e) => e.code || e.rule))].join(", ") || "none";
console.log(`theme check: errors ${codes(theme.errors)}; warnings ${codes(theme.warnings)}`);
const errors = theme.errors?.length ?? 0;
const warnings = theme.warnings?.length ?? 0;

const count = (await api("GET", "/posts/?limit=1&fields=id")).meta.pagination.total;
if (count !== posts.length) throw new Error(`expected ${posts.length} posts, found ${count}`);
console.log(`seed ok: ${createdTags} tags and ${createdPosts} posts created, ${count} posts total, theme ${THEME} active (${errors} errors, ${warnings} warnings)`);
