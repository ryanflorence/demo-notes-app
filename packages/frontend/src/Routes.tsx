import { Route, Routes } from "@remix-run/react";
import NotFound from "./containers/NotFound.tsx";

export default function Links() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}
