import React, { useEffect, useState } from "react";
import NoteItem from "./NoteItem";

export default function NoteList({ user, filters, userSubject }) {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  // fetch in fct de daca avem sau nu materie selectata
  useEffect(() => {
    if (userSubject == null) {
      if (user && user.UserId) {
        fetch(`/api/note/user/${user.UserId}`)
          .then((r) => r.json())
          .then((data) => {
            setNotes(data || []); 
            setFilteredNotes(data || []);
          })
          .catch((error) => console.error("Error fetching notes:", error));
      }
    } else {
      fetch(`/api/note/userSubject/${userSubject.UserSubjectId}`)
        .then((r) => r.json())
        .then((data) => {
          setNotes(data || []); 
          setFilteredNotes(data || []);
        })
        .catch((error) => console.error("Error fetching notes:", error));
    }
  }, [userSubject, user]);

  // filtrare locala
  useEffect(() => {
    const applyFilters = () => {
      const filtered = notes.filter((note) => {
        return (
          (filters.title === "" || note.Title.toLowerCase().includes(filters.title.toLowerCase())) &&
          (filters.content === "" || note.Content.toLowerCase().includes(filters.content.toLowerCase())) &&
          //de implemnetat
          (filters.tag === "" || (note.TagName && note.TagName.toLowerCase().includes(filters.tag.toLowerCase())))
        );
      });
      setFilteredNotes(filtered);
    };

    applyFilters();
  }, [filters, notes]);

  return (
    <div className="note-list">
      {Array.isArray(filteredNotes) && filteredNotes.length > 0 ? (
        filteredNotes.map((note) => <NoteItem key={note.id} note={note} />)
      ) : (
        <p>Nu există note disponibile.</p>
      )}
    </div>
  );
}
