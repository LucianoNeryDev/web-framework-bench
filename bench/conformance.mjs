// Conformance check: does a running target implement the Field Notes contract (docs/site-spec.md)?
//
//   node bench/conformance.mjs http://localhost:18080 [--server] [--no-browser]
//
// --server      the target renders ?q= and ?tag= on the server (required for every SSR/server target)
// --no-browser  skip the Playwright interaction checks
// Exit code 0 when every check passes. Prints one line per failure.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";

const here = dirname(fileURLToPath(import.meta.url));
const { site, tags, posts } = JSON.parse(readFileSync(join(here, "../content/posts.json"), "utf8"));
const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) || "http://localhost:18080").replace(/\/$/, "");
const serverMode = args.includes("--server");
const useBrowser = !args.includes("--no-browser");

const failures = [];
let checks = 0;
const check = (ok, message) => {
  checks++;
  if (!ok) failures.push(message);
  return ok;
};

const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
    e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : entities[e] ?? m);
const norm = (s) => decode(String(s)).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();
const textOf = (html) => norm(html.replace(/<[^>]+>/g, " "));

async function get(path) {
  const res = await fetch(base + path, { redirect: "manual" });
  const body = await res.text();
  return { status: res.status, type: res.headers.get("content-type") || "", body, location: res.headers.get("location") };
}

async function page(path, expectStatus = 200) {
  const r = await get(path);
  check(r.status === expectStatus, `${path}: status ${r.status}, expected ${expectStatus}${r.location ? ` (redirect to ${r.location})` : ""}`);
  check(r.type.includes("text/html"), `${path}: content-type "${r.type}", expected text/html`);
  return { ...r, doc: parse(r.body) };
}

function commonChecks(path, doc, { title, h1, current }) {
  const t = norm(doc.querySelector("title")?.text ?? "");
  check(t === norm(title), `${path}: <title> is "${t}", expected "${title}"`);
  check(doc.querySelector("html")?.getAttribute("lang") === "en", `${path}: <html lang="en"> missing`);
  check(!!doc.querySelector('meta[name="viewport"]'), `${path}: meta viewport missing`);
  check(!!doc.querySelector('meta[name="description"]')?.getAttribute("content"), `${path}: meta description missing`);
  check(!!doc.querySelector('link[rel="canonical"]'), `${path}: canonical link missing`);
  check(!!doc.querySelector('link[rel="alternate"][type="application/rss+xml"]'), `${path}: RSS alternate link missing`);
  check(!!doc.querySelector('link[rel="stylesheet"], style'), `${path}: no stylesheet`);
  check(!!doc.querySelector("a.skip-link[href='#main']"), `${path}: skip link missing`);
  check(!!doc.querySelector("main#main"), `${path}: <main id="main"> missing`);
  const nav = doc.querySelectorAll(".site-header nav.site-nav a").map((a) => a.getAttribute("href"));
  check(["/", "/blog", "/about"].every((h) => nav.includes(h)), `${path}: nav links are ${JSON.stringify(nav)}`);
  if (current) {
    const cur = doc.querySelector('.site-nav a[aria-current="page"]')?.getAttribute("href");
    check(cur === current, `${path}: aria-current nav link is ${cur}, expected ${current}`);
  }
  check(!!doc.querySelector("button.theme-toggle[aria-label]"), `${path}: theme toggle button missing`);
  check(!!doc.querySelector(".site-footer a[href='/rss.xml']"), `${path}: footer RSS link missing`);
  const h = norm(doc.querySelector("main h1")?.text ?? "");
  check(h === norm(h1), `${path}: <h1> is "${h}", expected "${h1}"`);
}

function cardChecks(path, cards, expected) {
  const slugs = cards.map((c) => c.querySelector("a.card-link")?.getAttribute("href")?.replace(/^\/blog\//, ""));
  const want = expected.map((p) => p.slug);
  check(JSON.stringify(slugs) === JSON.stringify(want), `${path}: cards ${JSON.stringify(slugs.slice(0, 4))}…(${slugs.length}), expected ${JSON.stringify(want.slice(0, 4))}…(${want.length})`);
  const first = cards[0];
  if (first && expected[0]) {
    const p = expected[0];
    check(norm(first.querySelector(".card-title")?.text ?? "") === norm(p.title), `${path}: first card title mismatch`);
    check(first.querySelector("img.card-image")?.getAttribute("src") === p.cover.thumb, `${path}: first card image src mismatch`);
    check(first.querySelector("time")?.getAttribute("datetime") === p.date, `${path}: first card <time datetime> mismatch`);
    check(norm(first.querySelector(".card-meta")?.text ?? "") === norm(`${p.dateLabel} · ${p.readingMinutes} min read`), `${path}: first card meta text mismatch`);
    const tagHrefs = first.querySelectorAll(".tag-list a.tag").map((a) => a.getAttribute("href"));
    check(JSON.stringify(tagHrefs) === JSON.stringify(p.tags.map((t) => `/blog?tag=${t}`)), `${path}: first card tag links ${JSON.stringify(tagHrefs)}`);
  }
}

const visibleCards = (doc) => doc.querySelectorAll("[data-post-list] .card").filter((c) => !c.hasAttribute("hidden"));
const filterPosts = (q, tag) =>
  posts.filter((p) => (!tag || p.tags.includes(tag)) && (!q || `${p.title} ${p.summary}`.toLowerCase().includes(q.toLowerCase())));

async function run() {
  // Home
  {
    const { doc } = await page("/");
    commonChecks("/", doc, { title: site.title, h1: site.heroTitle, current: "/" });
    const hero = doc.querySelector("img.hero-image");
    check(hero?.getAttribute("src") === "/images/hero.webp", "/: hero image src");
    check(hero?.getAttribute("fetchpriority") === "high", "/: hero image fetchpriority=high");
    cardChecks("/", doc.querySelectorAll(".latest .card"), posts.slice(0, 6));
  }

  // Blog index
  {
    const { doc } = await page("/blog");
    commonChecks("/blog", doc, { title: `Blog · ${site.title}`, h1: "Blog", current: "/blog" });
    check(!!doc.querySelector('form.filters input#q[name="q"][type="search"]'), "/blog: search input missing");
    check(!!doc.querySelector('label[for="q"]'), "/blog: search label missing");
    const chips = doc.querySelectorAll(".tag-filter button.chip");
    check(chips.length === tags.length + 1, `/blog: ${chips.length} tag chips, expected ${tags.length + 1}`);
    check(chips[0]?.getAttribute("aria-pressed") === "true", "/blog: the All chip is not pressed");
    check(norm(doc.querySelector(".result-count")?.text ?? "") === `Showing ${posts.length} of ${posts.length} posts`, "/blog: result count text");
    cardChecks("/blog", visibleCards(doc), posts);
  }

  if (serverMode) {
    for (const [q, tag] of [["cache", ""], ["", "go"], ["the", "security"], ["zzzz-no-match", ""]]) {
      const qs = new URLSearchParams({ ...(q && { q }), ...(tag && { tag }) }).toString();
      const path = `/blog?${qs}`;
      const { doc } = await page(path);
      const want = filterPosts(q, tag);
      cardChecks(path, visibleCards(doc), want);
      check(norm(doc.querySelector(".result-count")?.text ?? "") === `Showing ${want.length} of ${posts.length} posts`, `${path}: result count text`);
      check(doc.querySelector("input#q")?.getAttribute("value") === (q || null) || (!q && !doc.querySelector("input#q")?.getAttribute("value")), `${path}: search input value not pre-filled`);
      const pressed = doc.querySelector('.tag-filter button.chip[aria-pressed="true"]');
      check(norm(pressed?.text ?? "") === (tag ? tags.find((t) => t.slug === tag).name : "All"), `${path}: pressed chip`);
      const empty = doc.querySelector(".empty");
      check(want.length === 0 ? !!empty && !empty.hasAttribute("hidden") : !empty || empty.hasAttribute("hidden"), `${path}: empty-state visibility`);
    }
  }

  // Every post
  for (const p of posts) {
    const path = `/blog/${p.slug}`;
    const { doc } = await page(path);
    commonChecks(path, doc, { title: `${p.title} · ${site.title}`, h1: p.title, current: "/blog" });
    check(doc.querySelector("article.post .post-meta time")?.getAttribute("datetime") === p.date, `${path}: post date`);
    check(doc.querySelector("img.post-cover")?.getAttribute("src") === p.cover.src, `${path}: cover image`);
    const body = textOf(doc.querySelector(".post-body")?.innerHTML ?? "");
    check(body === textOf(p.html), `${path}: .post-body text differs from content/posts.json`);
    const bodyHtml = doc.querySelector(".post-body")?.innerHTML ?? "";
    check((bodyHtml.match(/<pre[\s>][^]*?<code/g) || []).length === (p.html.match(/<pre>/g) || []).length, `${path}: code block count`);
    const prev = doc.querySelector('.post-nav a[rel="prev"]')?.getAttribute("href");
    const next = doc.querySelector('.post-nav a[rel="next"]')?.getAttribute("href");
    check(prev === (p.prev ? `/blog/${p.prev}` : undefined), `${path}: prev link ${prev}`);
    check(next === (p.next ? `/blog/${p.next}` : undefined), `${path}: next link ${next}`);
    cardChecks(`${path} related`, doc.querySelectorAll(".related .card"), p.related.map((s) => bySlug[s]));
  }

  // About, 404s, feeds, health, assets
  {
    const { doc } = await page("/about");
    commonChecks("/about", doc, { title: `About · ${site.title}`, h1: "About", current: "/about" });
    check(doc.querySelector("img.about-avatar")?.getAttribute("src") === "/images/avatar.webp", "/about: avatar");
  }
  for (const path of ["/this-page-does-not-exist", "/blog/this-post-does-not-exist"]) {
    const { doc } = await page(path, 404);
    check(norm(doc.querySelector("main h1")?.text ?? "") === "Page not found", `${path}: 404 page h1`);
  }
  {
    const r = await get("/rss.xml");
    check(r.status === 200 && /xml/.test(r.type), `/rss.xml: status ${r.status} type ${r.type}`);
    const items = r.body.match(/<item>/g) || [];
    check(items.length === posts.length, `/rss.xml: ${items.length} items, expected ${posts.length}`);
    check(r.body.includes(`<link>${site.url}/blog/${posts[0].slug}</link>`), "/rss.xml: first item link");
  }
  {
    // A flat urlset, or a sitemap index (Ghost, WordPress) whose children together list every URL.
    const r = await get("/sitemap.xml");
    check(r.status === 200 && /xml/.test(r.type), `/sitemap.xml: status ${r.status} type ${r.type}`);
    const locsOf = (xml) => [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => decode(m[1]));
    let urls = [];
    if (/<sitemapindex/.test(r.body)) {
      for (const child of locsOf(r.body)) {
        const childPath = child.replace(/^https?:\/\/[^/]+/, "");
        const c = await get(childPath);
        check(c.status === 200, `${childPath}: status ${c.status}`);
        urls.push(...locsOf(c.body));
      }
    } else {
      urls = locsOf(r.body);
    }
    const want = ["/", "/blog", "/about", ...posts.map((p) => `/blog/${p.slug}`)].map((u) => site.url + u);
    const missing = want.filter((u) => !urls.includes(u));
    check(missing.length === 0, `/sitemap.xml: ${missing.length} expected URLs missing, e.g. ${missing.slice(0, 2).join(", ")}`);
  }
  {
    const r = await get("/healthz");
    check(r.status === 200, `/healthz: status ${r.status}`);
  }
  for (const asset of ["/images/hero.webp", posts[0].cover.thumb, "/favicon.svg"]) {
    const r = await fetch(base + asset);
    check(r.status === 200, `${asset}: status ${r.status}`);
  }

  if (useBrowser) await browserChecks();
}

async function browserChecks() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const pageErrors = [];
    const pw = await context.newPage();
    pw.on("pageerror", (e) => pageErrors.push(e.message));
    pw.on("console", (m) => m.type() === "error" && pageErrors.push(m.text()));

    const visible = () => pw.locator("[data-post-list] .card:visible").count();
    const countText = () => pw.locator(".result-count").innerText();

    await pw.goto(base + "/blog", { waitUntil: "networkidle" });
    await pw.fill("#q", "cache");
    let want = filterPosts("cache", "");
    await pw.waitForFunction((n) => document.querySelectorAll("[data-post-list] .card").length >= 0, null);
    await expectEventually(async () => (await visible()) === want.length, `browser /blog: typing "cache" shows ${await visible()} cards, expected ${want.length}`);
    await expectEventually(async () => norm(await countText()) === `Showing ${want.length} of ${posts.length} posts`, `browser /blog: count text after search is "${await countText()}"`);

    await pw.fill("#q", "");
    await pw.click('.tag-filter button.chip:text-is("Go")');
    want = filterPosts("", "go");
    await expectEventually(async () => (await visible()) === want.length, `browser /blog: Go chip shows ${await visible()} cards, expected ${want.length}`);
    await expectEventually(async () => (await pw.getAttribute('.tag-filter button.chip:text-is("Go")', "aria-pressed")) === "true", "browser /blog: Go chip not aria-pressed");
    await expectEventually(async () => new URL(pw.url()).searchParams.get("tag") === "go", `browser /blog: URL ${pw.url()} lacks tag=go`);

    await pw.click('.tag-filter button.chip:text-is("All")');
    await expectEventually(async () => (await visible()) === posts.length, "browser /blog: All chip does not restore every card");

    await pw.goto(base + "/blog?tag=security&q=the", { waitUntil: "networkidle" });
    want = filterPosts("the", "security");
    await expectEventually(async () => (await visible()) === want.length, `browser /blog?tag=security&q=the: ${await visible()} cards, expected ${want.length}`);

    await pw.goto(base + "/", { waitUntil: "networkidle" });
    const before = await pw.evaluate(() => document.documentElement.dataset.theme || "light");
    await pw.click("button.theme-toggle");
    const after = await pw.evaluate(() => document.documentElement.dataset.theme || "light");
    check(before !== after, "browser /: theme toggle did not change html[data-theme]");
    await pw.reload({ waitUntil: "networkidle" });
    const persisted = await pw.evaluate(() => document.documentElement.dataset.theme || "light");
    check(persisted === after, "browser /: theme choice did not persist across reload");

    await pw.goto(base + `/blog/${posts[0].slug}`, { waitUntil: "networkidle" });
    await pw.click(".post-nav a[rel='prev']");
    await pw.waitForURL(`**/blog/${posts[0].prev}`);
    await expectEventually(async () => norm(await pw.locator("main h1").innerText()) === norm(bySlug[posts[0].prev].title), "browser: prev link navigation did not render the older post");

    check(pageErrors.length === 0, `browser: console/page errors: ${pageErrors.slice(0, 3).join(" | ")}`);
  } finally {
    await browser.close();
  }
}

async function expectEventually(fn, message, timeout = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await fn()) return check(true, message);
    await new Promise((r) => setTimeout(r, 100));
  }
  return check(false, message);
}

run()
  .catch((e) => failures.push(`crashed: ${e.stack || e}`))
  .finally(() => {
    for (const f of failures) console.log(`FAIL ${f}`);
    console.log(`${checks - failures.length}/${checks} checks passed against ${base}${serverMode ? " (server mode)" : ""}`);
    process.exit(failures.length ? 1 : 0);
  });
