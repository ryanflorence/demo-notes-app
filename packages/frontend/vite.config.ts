import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [remix({ appDirectory: "src", ssr: false })],
});
