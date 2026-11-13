// Writes the posts.json fields Ghost has no place for into the theme as partials (run at image build time).
//
// Ghost posts have no custom fields. The contract fixes three values per post that Ghost would otherwise compute
// differently or not at all, so the theme looks them up by slug with a dynamic partial, {{> (concat "data/x/" slug)}}:
//   data/minutes/<slug>.hbs  readingMinutes (Ghost's {{reading_time}} uses 275 wpm plus image time)
//   data/search/<slug>.hbs   lower-cased "title summary" for app.js (Handlebars has no lower-case helper)
//   data/related/<slug>.hbs  the three related posts, fetched with one {{#get}} and rendered in the given order
//   data/tag-chips.hbs       the blog filter chips, in the dataset's tag order
//
// Usage: node theme-data.mjs <posts.json> <theme dir>
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [postsFile, themeDir] = process.argv.slice(2);
if (!postsFile || !themeDir) throw new Error("usage: node theme-data.mjs <posts.json> <theme dir>");
const { tags, posts } = JSON.parse(readFileSync(postsFile, "utf8"));
const out = join(themeDir, "partials", "data");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const safe = (s) => {
  if (/\{\{|\\/.test(s)) throw new Error(`refusing Handlebars syntax in data: ${s}`);
  return s;
};

rmSync(out, { recursive: true, force: true });
for (const dir of ["minutes", "search", "related"]) mkdirSync(join(out, dir), { recursive: true });

for (const post of posts) {
  writeFileSync(join(out, "minutes", `${post.slug}.hbs`), String(post.readingMinutes));
  writeFileSync(join(out, "search", `${post.slug}.hbs`), safe(esc(`${post.title} ${post.summary}`.toLowerCase())));
  const related = post.related.map((slug) => `{{#foreach posts}}{{#match slug "${slug}"}}\n{{> card}}\n{{/match}}{{/foreach}}`);
  writeFileSync(
    join(out, "related", `${post.slug}.hbs`),
    `{{#get "posts" filter="slug:[${post.related.join(",")}]" limit="3" include="tags"}}\n${related.join("\n")}\n{{/get}}`,
  );
}

writeFileSync(
  join(out, "tag-chips.hbs"),
  tags.map((t) => `<button type="button" class="chip" data-tag="${esc(t.slug)}" aria-pressed="false">${esc(t.name)}</button>`).join("\n") + "\n",
);
console.log(`wrote ${posts.length * 3 + 1} data partials to ${out}`);
