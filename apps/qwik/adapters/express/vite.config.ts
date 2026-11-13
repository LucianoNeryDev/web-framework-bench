import { nodeServerAdapter } from "@builder.io/qwik-city/adapters/node-server/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.express.tsx", "@qwik-city-plan"],
      },
    },
    plugins: [nodeServerAdapter({
        name: "express",
        // Server mode renders every page per request: no prerendering at all (the adapter would otherwise
        // prerender 404.html and an empty sitemap.xml into dist/).
        ssg: null,
      })],
  };
});
