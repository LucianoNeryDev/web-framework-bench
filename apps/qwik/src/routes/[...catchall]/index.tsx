import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { NotFound } from "~/components/not-found";
import { pageHead } from "~/lib/head";

// Qwik City answers unknown URLs with a generic page that is prerendered at build time. A catch-all route
// renders the site's own 404 page per request instead, with a real 404 status. The static build does not
// prerender it (no static paths); there 404.html comes from routes/404.tsx.
export const useStatus = routeLoader$(({ status }) => {
  status(404);
  return null;
});

export default component$(() => {
  useStatus();
  return <NotFound />;
});

export const head: DocumentHead = ({ params }) =>
  pageHead({
    path: `/${params.catchall ?? ""}`,
    title: "Page not found",
    description: "This page does not exist.",
    image: "/images/hero.webp",
  });
