import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { NotFound } from "~/components/not-found";
import { pageHead } from "~/lib/head";

export default component$(() => <NotFound />);

export const head: DocumentHead = pageHead({
  path: "/404",
  title: "Page not found",
  description: "This page does not exist.",
  image: "/images/hero.webp",
});
