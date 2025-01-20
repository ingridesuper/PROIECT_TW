import React from "react";
import { Link } from "react-router-dom";
import "../component_styles/NoteItem.css"

export default function NoteItem({ note }) {
  return (
    <div className="note-card">
      <div className="note-card-content">
        <h3 className="note-title">{note.Title || "Titlu lipsă"}</h3>
        <p className="note-summary">
          {note.Content ? note.Content.slice(0, 300) + "..." : "Conținut lipsă"}
        </p> {/* preview content*/}
      </div>
      <Link to={`/notes/${note.id}`} className="note-link">
        Edit
      </Link>
    </div>
  );
}
