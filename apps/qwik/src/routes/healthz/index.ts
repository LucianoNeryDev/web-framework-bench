import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = ({ headers, send }) => {
  headers.set("Content-Type", "text/plain; charset=utf-8");
  send(200, "ok\n");
};
