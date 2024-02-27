import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    noExternal:
      // misconfigured esm packages: node SSG pass breaks if they're not
      // included in the bundle but vite breaks in dev mode if they are
      // someone get me out of bundler hell plz
      process.env.NODE_ENV === "production"
        ? ["react-bootstrap", "react-icons"]
        : [],
  },
  plugins: [
    remix({
      appDirectory: "src",
      ssr: false,
      routes(defineRoutes) {
        return defineRoutes(route => {
          // fallback to component Routes.tsx for all URLs and the root index
          // there's a warning in the console but we'll adjust it later
          route("", "Routes.tsx", { index: true, id: "root-index" });
          route("*", "Routes.tsx");
        });
      },
    }),
  ],
});
