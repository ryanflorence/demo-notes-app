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
