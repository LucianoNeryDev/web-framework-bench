export const useTagNames = () => {
  const { tags } = useRuntimeConfig().public;
  return Object.fromEntries(tags.map((t: { slug: string; name: string }) => [t.slug, t.name])) as Record<string, string>;
};
