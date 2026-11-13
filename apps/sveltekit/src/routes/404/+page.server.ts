import { error } from "@sveltejs/kit";

// Static mode prerenders this page to 404.html (a real, laid-out 404 page for nginx's error_page).
// Server mode has no use for the route: it answers 404 like any unknown path.
export const load = () => {
  if (!__WFB_STATIC__) error(404, "Not found");
};
