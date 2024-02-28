import {
  useFetcher,
  redirect,
  ClientActionFunctionArgs,
} from "@remix-run/react";
import { Auth } from "aws-amplify";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { onError } from "../lib/errorLib";
import { useFormFields } from "../lib/hooksLib";
import LoaderButton from "../components/LoaderButton.tsx";
import { isAuthenticated } from "../lib/authLib.ts";
import "./Login.css";

export async function clientLoader() {
  return (await isAuthenticated()) ? redirect("/") : null;
}

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const fields = await request.json();
  try {
    await Auth.signIn(fields.email, fields.password);
    return redirect("/");
  } catch (error) {
    onError(error);
    return null;
  }
}

export default function Login() {
  const fetcher = useFetcher<typeof clientAction>();

  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  return (
    <div className="Login">
      <Form
        method="post"
        onSubmit={e => {
          e.preventDefault();
          fetcher.submit(fields, {
            method: "post",
            encType: "application/json",
          });
        }}
      >
        <Stack gap={3}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              size="lg"
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
          <LoaderButton
            size="lg"
            type="submit"
            isLoading={fetcher.state !== "idle"}
            disabled={!validateForm()}
          >
            Login
          </LoaderButton>
        </Stack>
      </Form>
    </div>
  );
}
