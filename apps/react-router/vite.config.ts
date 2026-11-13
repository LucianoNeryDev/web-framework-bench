import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // WFB_MODE is readable as import.meta.env.WFB_MODE in server and client code.
  envPrefix: ["VITE_", "WFB_"],
  plugins: [reactRouter()],
});
