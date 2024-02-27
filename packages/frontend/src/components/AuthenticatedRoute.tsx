import { ReactElement } from "react";
import { Navigate, useLocation } from "@remix-run/react";
import { useAppContext } from "../lib/contextLib";

export default function AuthenticatedRoute({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${pathname}${search}`} />;
  }

  return children;
}
