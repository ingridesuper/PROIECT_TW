import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import "./NewNote.css";

export default function EditNote({ user }) {
    const { noteId } = useParams(); // id din url
    const navigate = useNavigate(); // pt redirectionare

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagId, setTagId] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null); // materie selectata (obiect)
    const [userSubject, setUserSubject] = useState(null); // user subject (obiect)
    const [attachments, setAttachments] = useState([]); // atașamentele existente
    const [newFiles, setNewFiles] = useState([]); // atașamente noi

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

                const attachmentsResponse = await fetch(`/api/attachment/note/${noteId}`);
                const existingAttachments = await attachmentsResponse.json();
                setAttachments(existingAttachments);
            } catch (error) {
                console.error("Eroare la preluarea notei sau materiilor:", error);
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

    const handleFileChange = (e) => {
        setNewFiles(Array.from(e.target.files)); 
    };

    const handleDeleteAttachment = async (attachmentId) => {
        try {
            await fetch(`/api/attachment/${attachmentId}`, { method: 'DELETE' });
            setAttachments(attachments.filter(attachment => attachment.id !== attachmentId));
        } catch (error) {
            console.error("Eroare la ștergerea atașamentului:", error);
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

            if (!response.ok) {
                throw new Error("Eroare la actualizarea notei.");
            }

            if (newFiles.length > 0) {
                const formData = new FormData();
                newFiles.forEach(file => formData.append('files', file));

                const uploadResponse = await fetch(`/api/attachment/note/${noteId}`, {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Eroare la încărcarea atașamentelor.");
                }

                const uploadedAttachments = await uploadResponse.json();
                setAttachments([...attachments, ...uploadedAttachments.attachments]);
                setNewFiles([]);
            }

            console.log("Nota a fost actualizată cu succes!");
            navigate(`../notes`);
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
                        {subjects.map((subject) => (
                            <option key={subject.SubjectId} value={subject.SubjectId}>
                                {subject.SubjectName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Fișiere atașate:</label>
                    <ul>
                        {attachments.map(attachment => (
                            <li key={attachment.id}>
                                <a href={`/uploads/${attachment.filename}`} target="_blank" rel="noopener noreferrer">
                                    {attachment.FileName}
                                </a>
                                <button type="button" onClick={() => handleDeleteAttachment(attachment.id)}>Șterge</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="form-group">
                    <label htmlFor="files">Adaugă atașamente:</label>
                    <input
                        type="file"
                        multiple
                        id="files"
                        onChange={handleFileChange}
                    />
                </div>

                <button type="submit">Salvează modificările</button>
            </form>
        </div>
    );
}
