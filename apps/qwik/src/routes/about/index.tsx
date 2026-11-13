import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { pageHead } from "~/lib/head";
import { site } from "~/lib/site";

export default component$(() => (
  <section class="about">
    <h1>About</h1>
    <img
      class="about-avatar"
      src="/images/avatar.webp"
      alt={`Portrait of ${site.author}`}
      width={160}
      height={160}
    />
    <div class="about-body" dangerouslySetInnerHTML={site.aboutHtml} />
  </section>
));

export const head: DocumentHead = pageHead({
  path: "/about",
  title: "About",
  description: `About ${site.author} and ${site.title}.`,
  image: "/images/avatar.webp",
});
