import {
  useFetcher,
  redirect,
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "react-router";
import { Auth } from "aws-amplify";
import Form from "react-bootstrap/cjs/Form";
import Stack from "react-bootstrap/cjs/Stack";
import { onError } from "../lib/errorLib";
import LoaderButton from "../components/LoaderButton.tsx";
import { requireNoAuth } from "../lib/authLib.ts";
import "./Login.css";

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  return requireNoAuth(request);
}

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  try {
    await Auth.signIn(email, password);
    return redirect("/");
  } catch (error) {
    onError(error);
    return null;
  }
}

export default function Login() {
  const fetcher = useFetcher<typeof clientAction>();
  const isLoading = fetcher.state !== "idle";

  return (
    <div className="Login">
      <fetcher.Form method="post">
        <Stack gap={3}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              size="lg"
              type="email"
              name="email"
              required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control size="lg" type="password" name="password" required />
          </Form.Group>
          <LoaderButton size="lg" type="submit" isLoading={isLoading}>
            Login
          </LoaderButton>
        </Stack>
      </fetcher.Form>
    </div>
  );
}
