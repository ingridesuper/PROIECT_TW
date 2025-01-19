import React, { useState, useEffect } from "react";
import NoteList from "../../components/note_components/NoteList";
import { Link } from "react-router-dom";
import './Notes.css';

export default function Notes({ user }) {
  const [filters, setFilters] = useState({
    title: "",
    content: "",
    tag: ""
  });

  // mat la care e inrolat
  const [subjects, setSubjects] = useState([]);

  const [userSubject, setUserSubject] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState('');

  // mat la care e inrolat
  useEffect(() => {
    const fetchUserSubjects = async () => {
      try {
        const response = await fetch(`/api/subject/${user.UserId}/subjects`);
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    if (user && user.UserId) {
      fetchUserSubjects();
    }
  }, [user]);

  //schimbare mat selectata
  const handleUserSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);

    if (subjectId === "") {
      setUserSubject(null);
      return;
    }

    try {
      const response = await fetch(`/api/userSubject/user/${user.UserId}/subject/${subjectId}`);
      const data = await response.json();

      if (data) {
        setUserSubject(data);
      } else {
        console.error("Nu s-a găsit combinația User-Subject");
      }
    } catch (error) {
      console.error("Error fetching user subject:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <>
      {/* add notitia noua */}
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

        {/* spinner selectare materie */}
        <div className="spinner">
          <label htmlFor="subjectId">După materie:</label>
          <select
            id="subjectId"
            value={selectedSubject}
            onChange={handleUserSubjectChange}
          >
            <option value="">Alege o materie</option>
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <option key={subject.SubjectId} value={subject.SubjectId}>
                  {subject.SubjectName}
                </option>
              ))
            ) : (
              <option value="" disabled>Nu sunteți înrolat la nicio materie</option>
            )}
          </select>
        </div>

      </div>

      <div className="notes-container">
        <NoteList user={user} filters={filters} userSubject={userSubject} />
      </div>
    </>
  );
}
