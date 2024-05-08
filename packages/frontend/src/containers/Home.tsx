import { API } from "aws-amplify";
import { NoteType } from "../types/note";
import { BsPencilSquare } from "react-icons/bs/index";
import ListGroup from "react-bootstrap/cjs/ListGroup";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";
import { checkAuth } from "../lib/authLib";
import { useLoaderData } from "react-router";

export async function clientLoader() {
  const isAuthenticated = await checkAuth();
  return {
    isAuthenticated,
    notes: isAuthenticated ? await API.get("notes", "/notes", {}) : null,
  };
}

export default function Home() {
  const { isAuthenticated, notes } = useLoaderData() as {
    isAuthenticated: boolean;
    notes: NoteType[] | null;
  };

  function formatDate(str: undefined | string) {
    return !str ? "" : new Date(str).toLocaleString();
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <ListGroup>
          <LinkContainer to="/notes/new">
            <ListGroup.Item action className="py-3 text-nowrap text-truncate">
              <BsPencilSquare size={17} />
              <span className="ms-2 fw-bold">Create a new note</span>
            </ListGroup.Item>
          </LinkContainer>
          {(notes as NoteType[]).map(({ noteId, content, createdAt }) => (
            <LinkContainer key={noteId} to={`/notes/${noteId}`}>
              <ListGroup.Item
                active={false} // remove weird active styling from react-bootstrap
                action
                className="text-nowrap text-truncate"
              >
                <span className="fw-bold">{content.trim().split("\n")[0]}</span>
                <br />
                <span className="text-muted">
                  Created: {formatDate(createdAt)}
                </span>
              </ListGroup.Item>
            </LinkContainer>
          ))}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
