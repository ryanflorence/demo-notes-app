import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import { startTransition } from "react";

startTransition(() => {
  hydrateRoot(document, <RemixBrowser />);
});
