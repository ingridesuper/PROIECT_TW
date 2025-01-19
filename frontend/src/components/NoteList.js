import React, { useEffect, useState } from "react";
import NoteItem from "./NoteItem";

export default function NoteList({ user, filters }) {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    if (user && user.UserId) {
      fetch(`/api/note/user/${user.UserId}`)
        .then((r) => r.json())
        .then((data) => {
          setNotes(data || []); // daca nu sunt note, set un array gol
          setFilteredNotes(data || []); 
        })
        .catch((error) => console.error("Error fetching notes:", error));
    }
  }, [user]);

  //am ales sa nu apelez api, doar sa fac filtru pe toate notitele; avand in vedere ca dim sunt reduse oricum
  useEffect(() => {
    const applyFilters = () => {
      const filtered = notes.filter((note) => {
        return (
          (filters.title === "" || note.Title.toLowerCase().includes(filters.title.toLowerCase())) &&
          (filters.content === "" || note.Content.toLowerCase().includes(filters.content.toLowerCase())) &&
          //de implementat tag-ul
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
