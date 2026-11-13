// Answered by nginx in static mode (shared/nginx/static.conf); this endpoint serves it in server mode.
export function GET() {
  return new Response("ok\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
