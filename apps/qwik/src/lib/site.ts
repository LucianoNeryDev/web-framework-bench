// Named JSON imports are tree-shaken: only site and tags reach the client, never the 40 posts.
export { site, tags } from "../../../../content/posts.json";
