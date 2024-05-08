import { defineConfig } from "vite";
import { vitePlugin as react } from "@react-router/dev";
import inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      appDirectory: "src",
      ssr: false,
      future: {
        unstable_singleFetch: true,
      },
      // routes(defineRoutes) {
      // }
    }),
    inspect(),
  ],
});
