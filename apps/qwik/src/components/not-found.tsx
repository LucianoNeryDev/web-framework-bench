import { Link } from "@builder.io/qwik-city";

export const NotFound = () => (
  <section class="not-found">
    <h1>Page not found</h1>
    <p>The page you asked for does not exist or has moved.</p>
    <p>
      <Link class="button" href="/">
        Back to the home page
      </Link>
    </p>
  </section>
);
