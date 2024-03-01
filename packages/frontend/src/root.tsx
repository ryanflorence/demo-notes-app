import {
  Form,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  redirect,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import * as React from "react";
import { Auth } from "aws-amplify";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Outlet } from "@remix-run/react";
import { LinkContainer } from "react-router-bootstrap";
import { BsArrowRepeat } from "react-icons/bs";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { checkAuth } from "./lib/authLib";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Scratch - A simple note taking app</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="A simple note taking app" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://fonts.googleapis.com/css?family=PT+Serif|Open+Sans:300,400,600,700,800"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.global = window; var exports = {};`,
          }}
        />
        <Links />
        <Meta />
      </head>
      <body>
        <div id="root">{children}</div>
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
        <Navbar.Brand className="fw-bold text-muted">
          Scratch <BsArrowRepeat className="spinning" />
        </Navbar.Brand>
      </Navbar>
    </div>
  );
}

export async function clientLoader() {
  return { isAuthenticated: await checkAuth() };
}

export async function clientAction() {
  await Auth.signOut();
  return redirect("/login");
}

export default function App() {
  const { isAuthenticated } = useLoaderData<typeof clientLoader>();
  const navigation = useNavigation();

  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold text-muted">
            Scratch{" "}
            {navigation.location && <BsArrowRepeat className="spinning" />}
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={window.location.pathname}>
            {isAuthenticated ? (
              <>
                <LinkContainer to="/settings">
                  <Nav.Link>Settings</Nav.Link>
                </LinkContainer>
                <Form method="post">
                  <button className="nav-link" type="submit">
                    Logout
                  </button>
                </Form>
              </>
            ) : (
              <>
                <LinkContainer to="/signup">
                  <Nav.Link>Signup</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </div>
  );
}
