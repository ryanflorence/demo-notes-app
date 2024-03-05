import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    remix({
      appDirectory: "src",
      ssr: false,
      routes(defineRoutes) {
        return defineRoutes(route => {
          route("", "containers/Home.tsx", { index: true });
          route("/login", "containers/Login.tsx");
          route("/signup", "containers/Signup.tsx");
          route("/settings", "containers/Settings.tsx");
          route("/notes/new", "containers/NewNote.tsx");
          route("/notes/:id", "containers/Notes.tsx");
          route("*", "Routes.tsx");
        });
      },
    }),
  ],
});
