// Prepares the build inputs from the shared files (nothing generated here is committed):
//   public/               copy of shared/public/ (images, favicon, style.css)
//   src/generated/index.ts  site metadata, tags and every post WITHOUT its body
//   src/generated/bodies/<slug>.ts + bodies.ts  one lazy-loadable module per post body
// Run from apps/angular (the shared files are found at ../../content and ../../shared).
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "../..");
const data = JSON.parse(readFileSync(join(repo, "content/posts.json"), "utf8"));

rmSync(join(root, "public"), { recursive: true, force: true });
cpSync(join(repo, "shared/public"), join(root, "public"), { recursive: true });

const gen = join(root, "src/generated");
rmSync(gen, { recursive: true, force: true });
mkdirSync(join(gen, "bodies"), { recursive: true });

const { site, tags, posts } = data;
const meta = posts.map(({ html, ...rest }) => rest);
writeFileSync(
  join(gen, "index.ts"),
  `import type { Site, Tag, PostMeta } from "../app/models";\n` +
    `export const site: Site = ${JSON.stringify(site)};\n` +
    `export const tags: Tag[] = ${JSON.stringify(tags)};\n` +
    `export const posts: PostMeta[] = ${JSON.stringify(meta)};\n`,
);

for (const p of posts) writeFileSync(join(gen, "bodies", `${p.slug}.ts`), `export default ${JSON.stringify(p.html)};\n`);
writeFileSync(
  join(gen, "bodies.ts"),
  `export const bodies: Record<string, () => Promise<string>> = {\n` +
    posts.map((p) => `  ${JSON.stringify(p.slug)}: () => import("./bodies/${p.slug}").then((m) => m.default),`).join("\n") +
    `\n};\n`,
);
console.log(`prepared ${posts.length} posts`);
