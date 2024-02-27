import { Links, Meta, Scripts } from "@remix-run/react";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Links />
        <Meta />
      </head>
      <body>
        Remix is running!
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function App() {
  return <h1>It works!</h1>;
}
