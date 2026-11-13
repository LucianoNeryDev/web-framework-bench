import { data } from "react-router";
import type { Route } from "./+types/not-found";
import { NotFound, notFoundMeta } from "~/components/NotFound";

// Server build: a real 404 status. Static build: /404 is pre-rendered to 404.html and
// nginx supplies the status (error_page 404 /404.html), so the loader must not throw there.
export function loader() {
  if (import.meta.env.WFB_MODE !== "static") throw data(null, { status: 404 });
  return null;
}

export const meta: Route.MetaFunction = () => notFoundMeta();

export default function NotFoundRoute() {
  return <NotFound />;
}
