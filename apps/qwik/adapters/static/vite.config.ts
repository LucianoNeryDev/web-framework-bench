import { staticAdapter } from "@builder.io/qwik-city/adapters/static/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["@qwik-city-plan"],
      },
    },
    plugins: [
      staticAdapter({
        origin: "https://bench.example",
        // /sitemap.xml is a hand-written endpoint (the contract wants the lastmod rules of the reference);
        // /healthz is answered by nginx in static mode.
        sitemapOutFile: null,
        exclude: ["/healthz"],
      }),
    ],
  };
});
