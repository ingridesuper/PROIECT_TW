import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor"; // Importă editorul
import "./NewNote.css"

export default function NewNote({ user }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); 
    const [tagId, setTagId] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [userSubject, setUserSubject] = useState('');

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

        const newNote = {
            Title: title,
            Content: content, 
            UserSubjectId: userSubject.UserSubjectId,
        };

        try {
            const response = await fetch('/api/note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            });

            if (response.ok) {
                console.log("Note created successfully!");
                setTitle('');
                setContent('');
                setSelectedSubject('');
                setUserSubject('');
                setTagId('');
            } else {
                console.error("Error creating note:", response.statusText);
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
                    <label htmlFor="content">Write your note in Markdown:</label>
                    <br></br>
                    {/* Editor Markdown */}
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
                        value={selectedSubject}
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

                <button type="submit">Save</button>
            </form>
        </div>
    );
}
