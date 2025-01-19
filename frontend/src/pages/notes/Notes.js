import React, { useState } from "react";
import NoteList from "../../components/note_components/NoteList"; 
import { Link } from "react-router-dom"; 
import './Notes.css';

export default function Notes({ user }) {
  const [filters, setFilters] = useState({
    title: "",
    content: "",
    tag: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <>
      {/* adaugare notita noua */}
      <Link to="./new" user={user}>
        <button className="fab">+</button>
      </Link>

      {/* formular filtrare */}
      <div className="filters">
        <input
          type="text"
          name="title"
          placeholder="Caută după titlu..."
          value={filters.title}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="content"
          placeholder="Caută după conținut..."
          value={filters.content}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="tag"
          placeholder="Caută după tag..."
          value={filters.tag}
          onChange={handleFilterChange}
        />
      </div>

      <div className="notes-container">
        <NoteList user={user} filters={filters} />
      </div>
    </>
  );
}
