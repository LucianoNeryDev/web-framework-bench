import { site } from "#lib/server/data.ts";

export const load = () => ({ title: site.title, author: site.author, aboutHtml: site.aboutHtml });
