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
          route("", "containers/Home.tsx", { index: true });
          route("/login", "containers/Login.tsx");
          route("/signup", "containers/Signup.tsx");
          route("*", "Routes.tsx");
        });
      },
    }),
  ],
});
