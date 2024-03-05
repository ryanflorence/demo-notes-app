import { Auth } from "aws-amplify";
import Form from "react-bootstrap/cjs/Form";
import Stack from "react-bootstrap/cjs/Stack";
import { onError } from "../lib/errorLib";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  redirect,
  useFetcher,
} from "@remix-run/react";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { requireNoAuth } from "../lib/authLib";

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  return requireNoAuth(request);
}

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const { intent, ...fields } = Object.fromEntries(
    await request.formData(),
  ) as Record<string, string>;
  try {
    if (intent === "signup") {
      await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      return { email: fields.email, password: fields.password };
    } else if (intent === "confirm") {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      return redirect("/");
    } else return null;
  } catch (e) {
    onError(e);
    return null;
  }
}

export default function Signup() {
  const fetcher = useFetcher<typeof clientAction>();
  const busy = fetcher.state !== "idle";
  const form = fetcher.data ? (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="confirm" />
      <input type="hidden" name="email" value={fetcher.data.email} />
      <input type="hidden" name="password" value={fetcher.data.password} />
      <Stack gap={3}>
        <Form.Group controlId="confirmationCode">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            size="lg"
            autoFocus
            type="tel"
            name="confirmationCode"
            required
          />
          <Form.Text muted>Please check your email for the code.</Form.Text>
        </Form.Group>
        <LoaderButton
          type="submit"
          size="lg"
          variant="success"
          isLoading={busy}
        >
          Verify
        </LoaderButton>
      </Stack>
    </fetcher.Form>
  ) : (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="signup" />
      <Stack gap={3}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            size="lg"
            autoFocus
            type="email"
            name="email"
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control size="lg" type="password" name="password" required />
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            size="lg"
            type="password"
            name="confirmPassword"
            required
            onChange={e => {
              const field = e.currentTarget as HTMLInputElement;
              const password = field.form!.password as HTMLInputElement;
              if (field.value !== password.value) {
                field.setCustomValidity("Passwords do not match.");
              } else {
                field.setCustomValidity("");
              }
            }}
          />
        </Form.Group>
        <LoaderButton
          type="submit"
          size="lg"
          variant="success"
          isLoading={busy}
        >
          Signup
        </LoaderButton>
      </Stack>
    </fetcher.Form>
  );

  return <div className="Signup">{form}</div>;
}
