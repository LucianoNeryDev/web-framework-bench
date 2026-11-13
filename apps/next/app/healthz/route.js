// Server mode only: in the static image nginx answers /healthz, and the Dockerfile drops this route.
export const GET = () => new Response("ok\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
