import { RemixServer } from "@remix-run/react";
import { EntryContext } from "@remix-run/node";
import { renderToString } from "react-dom/server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const html = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  );

  responseHeaders.set("Content-Type", "text/html");
  return new Response(`<!DOCTYPE html>${html}`, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
