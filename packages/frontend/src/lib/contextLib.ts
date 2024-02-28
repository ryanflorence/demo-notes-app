import { useRouteLoaderData } from "@remix-run/react";
import { type clientLoader } from "../root";

export function useAppContext() {
  return useRouteLoaderData("root") as Awaited<ReturnType<typeof clientLoader>>;
}
