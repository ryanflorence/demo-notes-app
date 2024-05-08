import { Route, Routes } from "react-router";
import NotFound from "./containers/NotFound.tsx";

export default function Links() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}
