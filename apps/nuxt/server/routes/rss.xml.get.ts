export default defineEventHandler((event) => {
  setResponseHeader(event, "content-type", "application/rss+xml; charset=utf-8");
  return renderRss();
});
