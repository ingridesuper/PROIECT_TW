import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../component_styles/NoteItem.css";

export default function NoteItem({ user, note, onDelete }) {
  const [attachments, setAttachments]=useState([])
  const handleDelete = async (e) => {
    e.preventDefault();

    if (window.confirm("Sigur vrei să ștergi această notă?")) {
      try {
        const response = await fetch(`/api/note/${note.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          console.log("Note deleted successfully");
          onDelete(note.id); // actualizare parinte
        } else {
          console.error("Error deleting note:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const response = await fetch(`/api/attachment/note/${note.id}`);
        const data = await response.json();
        setAttachments(data);
      } catch (error) {
        console.error("Error fetching attachments:", error);
      }
    };

    if (user && user.UserId) {
      fetchAttachments();
    }
  }, [user, note]);

  return (
    <div className="note-card">
      <div className="note-card-content">
        <h3 className="note-title">{note.Title || "Titlu lipsă"}</h3>
        <p className="note-summary">
          {note.Content ? note.Content.slice(0, 300) + "..." : "Conținut lipsă"}
        </p>
      </div>
      <br></br>
      {/* Afișare atașamente */}
      <div className="note-attachments">
        {attachments && attachments.length > 0 ? (
          <ul>
            {attachments.map((attachment) => (
              <li key={attachment.id}>
                <a id="linkAtasament" href={`/${attachment.FilePath}`} target="_blank" rel="noopener noreferrer">
                  {attachment.FileName}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p id="nuExistaAtasamenteParagraf">Nu există atașamente.</p>
        )}
      </div>
      <br></br>

      <div className="note-actions">
        <Link to={`/notes/${note.id}`} className="note-link">
          Edit
        </Link>
        <a href="#" onClick={handleDelete} className="delete-link">
          Delete
        </a>
      </div>
    </div>
  );
}
