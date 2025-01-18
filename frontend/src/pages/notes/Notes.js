import React, { useEffect, useState } from "react";
import NoteList from "../../components/NoteList"; 
import { Link } from "react-router-dom"; 
import './Notes.css';

export default function Notes() {
    const [notes, setNotes]=useState([])

    useEffect(() => {
      fetch("/api/note")
        .then((r) => {
          if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
          }
          return r.json();
        })
        .then((data) => setNotes(data))
        .catch((error) => console.error("Error fetching notes:", error));
    }, []);
    
    

  return (
    <>
    <Link to="./new">
    <button className="fab">+</button>
    </Link>
    
    <div className="notes-container">
      <NoteList notes={notes} />
    </div>
    </>
  );
}
