import { API } from "aws-amplify";
import Form from "react-bootstrap/Form";
import { redirect, useFetcher } from "@remix-run/react";
import { s3Upload } from "../lib/awsLib";
import { onError } from "../lib/errorLib";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewNote.css";
import { requireAuth } from "../lib/authLib";

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  return await requireAuth(request);
}

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData();
  const file = formData.get("attachment") as File | null;
  const content = String(formData.get("content"));

  if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
    alert(
      `Please pick a file smaller than ${
        config.MAX_ATTACHMENT_SIZE / 1000000
      } MB.`,
    );
    return null;
  }

  try {
    const attachment = file ? await s3Upload(file) : undefined;
    await API.post("notes", "/notes", { body: { content, attachment } });
    return redirect("/");
  } catch (e) {
    onError(e);
    return null;
  }
}

export default function NewNote() {
  const fetcher = useFetcher();
  return (
    <div className="NewNote">
      <fetcher.Form method="post" encType="multipart/form-data">
        <Form.Group controlId="content">
          <Form.Control as="textarea" name="content" required />
        </Form.Group>
        <Form.Group className="mt-2" controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control type="file" name="attachment" />
        </Form.Group>
        <LoaderButton
          size="lg"
          type="submit"
          variant="primary"
          isLoading={fetcher.state !== "idle"}
        >
          Create
        </LoaderButton>
      </fetcher.Form>
    </div>
  );
}
