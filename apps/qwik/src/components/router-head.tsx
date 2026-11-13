import { component$ } from "@builder.io/qwik";
import { useDocumentHead } from "@builder.io/qwik-city";

export const RouterHead = component$(() => {
  const head = useDocumentHead();
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{head.title}</title>
      {head.meta.map(({ key, ...m }) => (
        <meta key={key} {...m} />
      ))}
      {head.links.map(({ key, ...l }) => (
        <link key={key} {...l} />
      ))}
    </>
  );
});
