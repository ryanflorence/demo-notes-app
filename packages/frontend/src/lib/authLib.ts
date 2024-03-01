import { redirect } from "@remix-run/react";
import { Auth } from "aws-amplify";

export async function checkAuth() {
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
  if (!(await checkAuth())) {
    throw redirect(`/login?redirect=${pathname}${search}`);
  }
  return true;
}

function querystring(name: string, url = window.location.href) {
  const parsedName = name.replace(/[[]]/g, "\\$&");
  const regex = new RegExp(`[?&]${parsedName}(=([^&#]*)|&|#|$)`, "i");
  const results = regex.exec(url);

  if (!results || !results[2]) {
    return false;
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export async function requireNoAuth(request: Request) {
  const location = querystring("redirect", request.url) || "/";
  if (await checkAuth()) {
    throw redirect(location);
  }
  return true;
}
