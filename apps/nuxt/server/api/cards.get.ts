// Card data without post bodies. ?limit=6 serves the home page.
export default defineEventHandler((event) => {
  const limit = Number(getQuery(event).limit) || posts.length;
  return posts.slice(0, limit).map(toCard);
});
