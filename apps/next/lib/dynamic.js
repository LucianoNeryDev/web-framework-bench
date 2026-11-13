import { connection } from "next/server";
import { IS_STATIC } from "./site";

// Server mode renders every page per request: awaiting connection() opts the route out of
// prerendering. In the static export this is skipped, so the page is built once.
export async function renderPerRequest() {
  if (!IS_STATIC) await connection();
}
