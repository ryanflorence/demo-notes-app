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
    inspect(),
  ],
});
