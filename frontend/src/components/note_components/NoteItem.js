import React from "react";
import { Link } from "react-router-dom";
import "../component_styles/NoteItem.css";

export default function NoteItem({ note, onDelete }) {
  const handleDelete = async (e) => {
    e.preventDefault();

    if (window.confirm("Sigur vrei să ștergi această notă?")) {
      try {
        const response = await fetch(`/api/note/${note.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log("Note deleted successfully");
          // Apelăm funcția onDelete pentru a actualiza lista în componenta părinte
          onDelete(note.id);
        } else {
          console.error("Error deleting note:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  return (
    <div className="note-card">
      <div className="note-card-content">
        <h3 className="note-title">{note.Title || "Titlu lipsă"}</h3>
        <p className="note-summary">
          {note.Content ? note.Content.slice(0, 300) + "..." : "Conținut lipsă"}
        </p>
      </div>

      <div className="note-actions">
        <Link to={`/notes/${note.id}`} className="note-link">Edit</Link>
        <a href="#" onClick={handleDelete} className="delete-link">Delete</a>
      </div>
    </div>
  );
}
