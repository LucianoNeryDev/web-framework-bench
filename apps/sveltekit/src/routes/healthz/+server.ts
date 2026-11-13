// Server mode answers /healthz itself; in static mode nginx answers before this file is ever reached
// (it is still prerendered, to keep the static build strict).
export const prerender = __WFB_STATIC__;

export const GET = () => new Response("ok\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
