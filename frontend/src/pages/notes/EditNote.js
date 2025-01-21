import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import "./NewNote.css";

export default function EditNote({ user }) {
    const { noteId } = useParams(); // id din url
    const navigate = useNavigate(); //pt redirectionare

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagId, setTagId] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null); // materie selectata(obiect)
    const [userSubject, setUserSubject] = useState(null); // user subject (pbiect)


    useEffect(() => {
        const fetchNoteAndSubject = async () => {
            try {
                const noteResponse = await fetch(`/api/note/${noteId}`);
                const note = await noteResponse.json();
                setTitle(note.Title);
                setContent(note.Content || '');


                const subjectResponse = await fetch(`/api/note/${noteId}/getSubjectOfNote`);
                const subject = await subjectResponse.json();
                setSelectedSubject(subject); 


                if (subject?.SubjectId) {
                    const userSubjectResponse = await fetch(`/api/userSubject/user/${user.UserId}/subject/${subject.SubjectId}`);
                    const userSubjectData = await userSubjectResponse.json();
                    setUserSubject(userSubjectData);
                }
            } catch (error) {
                console.error("Eroare la preluarea notei sau materiei:", error);
            }
        };

        const fetchUserSubjects = async () => {
            try {
                const response = await fetch(`/api/subject/${user.UserId}/subjects`);
                const data = await response.json();
                setSubjects(data); 
            } catch (error) {
                console.error("Eroare la preluarea materiilor utilizatorului:", error);
            }
        };

        fetchNoteAndSubject();
        fetchUserSubjects();
    }, [noteId, user]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (value) => {
        setContent(value || "");
    };

    const handleUserSubjectChange = async (e) => {
        const subjectId = e.target.value;

        const selected = subjects.find(subject => subject.SubjectId === parseInt(subjectId, 10));
        setSelectedSubject(selected);

        try {
            const response = await fetch(`/api/userSubject/user/${user.UserId}/subject/${subjectId}`);
            const data = await response.json();
            setUserSubject(data);
        } catch (error) {
            console.error("Eroare la actualizarea UserSubject:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedNote = {
            Title: title,
            Content: content,
            UserSubjectId: userSubject?.UserSubjectId, 
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
                console.log("Notița a fost actualizată cu succes!");
                navigate(`../notes`);
            } else {
                console.error("Eroare la actualizarea notiței:", response.statusText);
            }
        } catch (error) {
            console.error("Eroare:", error);
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
                    placeholder="Titlu"
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
                        value={selectedSubject?.SubjectId || ''} 
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

                <button type="submit">Salvează modificările</button>
            </form>
        </div>
    );
}