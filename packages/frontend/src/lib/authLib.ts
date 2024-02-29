import { redirect } from "@remix-run/react";
import { Auth } from "aws-amplify";

export async function isAuthenticated() {
  try {
    await Auth.currentSession();
    return true;
  } catch (error) {
    if (error !== "No current user") throw error;
    return false;
  }
}

export async function requireAuth(request: Request) {
  const { pathname, search } = new URL(request.url);
  if (!(await isAuthenticated())) {
    throw redirect(`/login?redirect=${pathname}${search}`);
  }
  return true;
}
