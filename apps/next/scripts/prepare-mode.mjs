// Next.js route segment config must be a literal, so it cannot follow WFB_MODE inside the route files.
// Static export therefore needs a few source-level adjustments, applied to the build copy:
//   - the feeds must say `dynamic = "force-static"` (output: export refuses handlers without it),
//   - /healthz is answered by nginx, so the route handler is dropped.
// Server mode needs none of this: the files stay as committed and every route renders per request.
import { appendFileSync, rmSync } from "node:fs";

if (process.argv[2] === "static") {
  for (const f of ["app/rss.xml/route.js", "app/sitemap.js"]) appendFileSync(f, '\nexport const dynamic = "force-static";\n');
  rmSync("app/healthz", { recursive: true, force: true });
}
