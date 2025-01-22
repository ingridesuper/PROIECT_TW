import React, { useState, useEffect } from "react";
import NoteList from "../../components/note_components/NoteList";
import { Link } from "react-router-dom";
import './Notes.css';

export default function Notes({ user }) {

  // filtere selectate
  const [filters, setFilters] = useState({
    title: "",
    content: ""  });

  // materiile la care este înrolat utilizatorul
  const [subjects, setSubjects] = useState([]);
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

  // materie selectată (inițial null)
  const [selectedSubject, setSelectedSubject] = useState(null);

  // lista de note
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`/api/note/user/${user.UserId}`);
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    if (user && user.UserId) {
      fetchNotes();
    }
  }, [user]);

  // schimbarea materiei selectate si actualizarea notitelor
  const handleUserSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(null); //reset sel ant

    if (subjectId === "") {
      setSelectedSubject(null);
      try {
        const response = await fetch(`/api/note/user/${user.UserId}`);
        const data = await response.json();
        setNotes(data); // setăm toate notele
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
      return;
    }

    const subject = subjects.find(subject => subject.SubjectId === subjectId);

    if (subject) {
      setSelectedSubject(subject); 
    } else {
      console.error("Materie necunoscută");
    }

    try {
      const response = await fetch(`/api/note/user/${user.UserId}/subject/${subjectId}`);
      const data = await response.json();

      if (data) {
        setNotes(data);
      } else {
        console.error("Nu s-au găsit note pentru această materie.");
      }
    } catch (error) {
      console.error("Error fetching notes by subject:", error);
    }
  };

  // schimbarea filtrelor
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <>
      {/* add notita noua */}
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

        {/* spinner selectare materie */}
        <div className="spinner">
          <label id="labelDupaMaterie" htmlFor="subjectId">După materie:</label>
          <select
            id="subjectId"
            value={selectedSubject ? selectedSubject.SubjectId : null}
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
        <NoteList user={user} filters={filters} notes={notes} />
      </div>
    </>
  );
}
