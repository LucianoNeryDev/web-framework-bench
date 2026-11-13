export default defineEventHandler((event) => {
  const post = getPostPage(getRouterParam(event, "slug") ?? "");
  if (!post) throw createError({ statusCode: 404, statusMessage: "Post not found" });
  return post;
});
