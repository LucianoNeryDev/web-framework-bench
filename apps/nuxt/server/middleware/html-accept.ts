// Nuxt's error handler answers JSON to any client whose Accept header lacks text/html (curl, fetch, crawlers
// sending */*). A page route that fails must still return the HTML 404 page, so page requests are pinned to HTML.
export default defineEventHandler((event) => {
  const path = event.path.split("?")[0]!;
  if (path.startsWith("/api/") || path.startsWith("/_") || /\.\w+$/.test(path)) return;
  const accept = String(event.node.req.headers.accept ?? "");
  if (!accept.includes("json")) event.node.req.headers.accept = "text/html";
});
