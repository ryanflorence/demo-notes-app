import config from "../config";
import Form from "react-bootstrap/cjs/Form";
import { s3Upload } from "../lib/awsLib";
import Stack from "react-bootstrap/cjs/Stack";
import { API, Storage } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import {
  ClientLoaderFunctionArgs as CLFA,
  ClientActionFunctionArgs as CFFA,
  useLoaderData,
  useFetcher,
  redirect,
} from "@remix-run/react";
import { requireAuth } from "../lib/authLib";
import "./Notes.css";

export async function clientLoader({ request, params }: CLFA) {
  await requireAuth(request);
  const note = await API.get("notes", `/notes/${params.id}`, {});
  if (note.attachment) {
    note.attachmentURL = await Storage.vault.get(note.attachment);
  }
  return note;
}

export async function clientAction({ request, params }: CFFA) {
  const formData = await request.formData();

  if (formData.get("intent") === "delete") {
    await API.del("notes", `/notes/${params.id}`, {});
    return redirect("/");
  }

  const content = String(formData.get("content"));
  const currentFile = formData.get("attachment") as string | null;
  const file = formData.get("newAttachment") as File;

  if (file.size > config.MAX_ATTACHMENT_SIZE) {
    alert(
      `Please pick a file smaller than ${
        config.MAX_ATTACHMENT_SIZE / 1000000
      } MB.`,
    );
    return null;
  }

  const attachment = file.size ? await s3Upload(file) : currentFile;
  await API.put("notes", `/notes/${params.id}`, {
    body: { content, attachment },
  });

  return redirect("/");
}

export default function Notes() {
  const note = useLoaderData<typeof clientLoader>();
  const fetcher = useFetcher();

  function formatFilename(str: string) {
    return str.replace(/^\w+-/, "");
  }

  const confirm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      e.preventDefault();
    }
  };

  return (
    <div className="Notes">
      {note && (
        <fetcher.Form method="post" encType="multipart/form-data">
          <Stack gap={3}>
            <Form.Group controlId="content">
              <Form.Control
                defaultValue={note.content}
                size="lg"
                as="textarea"
                name="content"
                required
              />
            </Form.Group>
            <Form.Group className="mt-2" controlId="file">
              <Form.Label>Attachment</Form.Label>
              {note.attachment && (
                <p>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={note.attachmentURL}
                  >
                    {formatFilename(note.attachment)}
                  </a>
                </p>
              )}
              <input
                type="hidden"
                name="attachment"
                defaultValue={note.attachment}
              />
              <Form.Control type="file" name="newAttachment" />
            </Form.Group>
            <Stack gap={1}>
              <LoaderButton
                size="lg"
                type="submit"
                name="intent"
                value="save"
                isLoading={fetcher.formData?.get("intent") === "save"}
              >
                Save
              </LoaderButton>
              <LoaderButton
                size="lg"
                variant="danger"
                name="intent"
                value="delete"
                isLoading={fetcher.formData?.get("intent") === "delete"}
                onClick={confirm}
              >
                Delete
              </LoaderButton>
            </Stack>
          </Stack>
        </fetcher.Form>
      )}
    </div>
  );
}
