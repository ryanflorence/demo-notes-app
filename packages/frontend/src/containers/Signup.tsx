import { Auth } from "aws-amplify";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { onError } from "../lib/errorLib";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  redirect,
  useFetcher,
} from "@remix-run/react";
import { useFormFields } from "../lib/hooksLib";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { requireNoAuth } from "../lib/authLib";

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  return requireNoAuth(request);
}

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const { intent, ...fields } = await request.json();
  try {
    if (intent === "signup") {
      return await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
    } else if (intent === "confirm") {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      return redirect("/");
    }
  } catch (e) {
    onError(e);
    return null;
  }
}

export default function Signup() {
  const fetcher = useFetcher<typeof clientAction>();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  function submit(intent: "signup" | "confirm") {
    fetcher.submit(
      { ...fields, intent },
      { method: "post", encType: "application/json" },
    );
  }

  function renderConfirmationForm() {
    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          submit("confirm");
        }}
      >
        <Stack gap={3}>
          <Form.Group controlId="confirmationCode">
            <Form.Label>Confirmation Code</Form.Label>
            <Form.Control
              size="lg"
              autoFocus
              type="tel"
              onChange={handleFieldChange}
              value={fields.confirmationCode}
            />
            <Form.Text muted>Please check your email for the code.</Form.Text>
          </Form.Group>
          <LoaderButton
            size="lg"
            type="submit"
            variant="success"
            isLoading={fetcher.state !== "idle"}
            disabled={!validateConfirmationForm()}
          >
            Verify
          </LoaderButton>
        </Stack>
      </Form>
    );
  }

  function renderForm() {
    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          submit("signup");
        }}
      >
        <Stack gap={3}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              size="lg"
              autoFocus
              type="email"
              value={fields.email}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              value={fields.password}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              onChange={handleFieldChange}
              value={fields.confirmPassword}
            />
          </Form.Group>
          <LoaderButton
            size="lg"
            type="submit"
            variant="success"
            isLoading={fetcher.state !== "idle"}
            disabled={!validateForm()}
          >
            Signup
          </LoaderButton>
        </Stack>
      </Form>
    );
  }

  return (
    <div className="Signup">
      {fetcher.data == null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
