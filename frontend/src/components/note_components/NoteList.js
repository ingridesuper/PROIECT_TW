import React, { useEffect, useState } from "react";
import NoteItem from "./NoteItem";

export default function NoteList({ filters, notes, user }) {
  const [filteredNotes, setFilteredNotes] = useState([]);

  // filtrare locala -> pt filters
  useEffect(() => {
    const applyFilters = () => {
      const filtered = notes.filter((note) => {
        return (
          (filters.title === "" || note.Title.toLowerCase().includes(filters.title.toLowerCase())) &&
          (filters.content === "" || note.Content.toLowerCase().includes(filters.content.toLowerCase())) &&
          //de implementat
          (filters.tag === "" || (note.TagName && note.TagName.toLowerCase().includes(filters.tag.toLowerCase())))
        );
      });
      setFilteredNotes(filtered);
    };

    applyFilters();
  }, [filters, notes]);

  const handleDeleteNote = (deletedNoteId) => {
    setFilteredNotes((prevNotes) => prevNotes.filter((note) => note.id !== deletedNoteId));
  };

  return (
    <div className="note-list">
      {Array.isArray(filteredNotes) && filteredNotes.length > 0 ? (
        filteredNotes.map((note) => (
          <NoteItem key={note.id} note={note} onDelete={handleDeleteNote} user={user}/>
        ))
      ) : (
        <p>Nu există note disponibile.</p>
      )}
    </div>
  );
}
