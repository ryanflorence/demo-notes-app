import { Route, Routes } from "@remix-run/react";
import Notes from "./containers/Notes.tsx";
import NewNote from "./containers/NewNote.tsx";
import NotFound from "./containers/NotFound.tsx";
import AuthenticatedRoute from "./components/AuthenticatedRoute.tsx";

export default function Links() {
  return (
    <Routes>
      <Route
        path="/notes/new"
        element={
          <AuthenticatedRoute>
            <NewNote />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/notes/:id"
        element={
          <AuthenticatedRoute>
            <Notes />
          </AuthenticatedRoute>
        }
      />
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}
