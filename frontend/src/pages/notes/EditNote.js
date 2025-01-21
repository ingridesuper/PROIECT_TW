import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import "./NewNote.css";

export default function EditNote({ user }) {
    const { noteId } = useParams(); // obtinere id din url
    const navigate = useNavigate(); // redirectionare

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagId, setTagId] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [userSubject, setUserSubject] = useState('');

    //preluare nota și materii
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await fetch(`/api/note/${noteId}`);
                const note = await response.json();

                setTitle(note.Title);
                setContent(note.Content || '');
                setSelectedSubject(note.SubjectId || ''); //asta nu exista in tabela mea


                if (note.SubjectId) {
                    const userSubjectResponse = await fetch(`/api/userSubject/user/${user.UserId}/subject/${note.SubjectId}`);
                    const userSubjectData = await userSubjectResponse.json();
                    setUserSubject(userSubjectData);
                }
            } catch (error) {
                console.error("Error fetching note:", error);
            }
        };

        const fetchUserSubjects = async () => {
            try {
                const response = await fetch(`/api/subject/${user.UserId}/subjects`);
                const data = await response.json();
                setSubjects(data);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        fetchUserSubjects()

        fetchNote()

    }, [noteId, user]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (value) => {
        setContent(value || "");
    };

    const handleUserSubjectChange = async (e) => {
        const subjectId = e.target.value;
        setSelectedSubject(subjectId);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedNote = {
            Title: title,
            Content: content,
            UserSubjectId: userSubject.UserSubjectId,
        };

        try {
            const response = await fetch(`/api/note/${noteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedNote),
            });

            if (response.ok) {
                console.log("Note updated successfully!");
                navigate(`../notes`); //redirectionare
            } else {
                console.error("Error updating note:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="new-note-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Title"
                    required
                />

                <div className="form-group">
                    <label htmlFor="content">Notează în Markdown:</label>
                    <MDEditor
                        id="content"
                        value={content}
                        onChange={handleContentChange}
                        preview="live"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="subjectId">Selectează o materie:</label>
                    <select
                        id="subjectId"
                        value={selectedSubject} // Folosește direct ID-ul
                        onChange={handleUserSubjectChange}
                        required
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

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}
