import React, { useEffect, useState } from "react";
import NoteItem from "./NoteItem";

export default function NoteList({ user }) {
  const [notes, setNotes] = useState([]);
  

  useEffect(() => {
    if (user && user.UserId) {
      fetch(`/api/note/user/${user.UserId}`)
        .then((r) => {
          if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
          }
          return r.json();
        })
        .then((data) => {
          console.log(data)
          setNotes(data || []); //empty array, nu null
        })
        .catch((error) => console.error("Error fetching notes:", error));
    }
  }, [user]);

  return (
    <div className="note-list">
      {Array.isArray(notes) && notes.length > 0 ? (
        notes.map((note) => <NoteItem key={note.id} note={note} />)
      ) : (
        <p>Nu există note disponibile.</p>
      )}
    </div>
  );
}
