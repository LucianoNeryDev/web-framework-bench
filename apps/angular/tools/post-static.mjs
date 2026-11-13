// After `ng build --configuration static`: write rss.xml and sitemap.xml next to the prerendered pages.
import { renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { posts, site } from "../src/generated/index.ts";
import { rss, sitemap } from "../src/feeds.ts";

const out = join(dirname(fileURLToPath(import.meta.url)), "../dist/angular/browser");
// The prerendered /404 route becomes the file nginx serves for unknown URLs.
renameSync(join(out, "404/index.html"), join(out, "404.html"));
rmSync(join(out, "404"), { recursive: true });
writeFileSync(join(out, "rss.xml"), rss(site, posts));
writeFileSync(join(out, "sitemap.xml"), sitemap(site, posts));
console.log(`wrote rss.xml and sitemap.xml to ${out}`);
