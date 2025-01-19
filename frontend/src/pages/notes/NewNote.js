import React, { useState, useEffect } from "react";
import "./NewNote.css";

export default function NewNote({ user }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagId, setTagId] = useState(''); // de adaugat aici

    //materiile la care e inrolat userul curent
    const [subjects, setSubjects] = useState([]);

    //materia la care va posta notita
    const [selectedSubject, setSelectedSubject] = useState('');

    //intrarea corespunzatoarea materiei selectate (+userul curent)
    const [userSubject, setUserSubject] = useState(''); // combinatia de user curent si subject selectat

    // obtinere materii la care user-ul e inrolat
    useEffect(() => {
        const fetchUserSubjects = async () => {
            try {
                const response = await fetch(`/api/subject/${user.UserId}/subjects`);  //ret subjects
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

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    // handle schimbarea materiei selectate
    const handleUserSubjectChange = async (e) => {
        const subjectId = e.target.value; // obtine id materie selectata
        setSelectedSubject(subjectId); 

        // api - user subject
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


    //de implementat
    const handleTagChange = (e) => {
        setTagId(e.target.value);
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
                    <textarea
                        id="content"
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Content..."
                        required
                    />
                </div>

                {/* spinner pt selectarea materiei */}
                <div className="form-group">
                    <label htmlFor="subjectId">Selectează o materie:</label>
                    <select
                        id="subjectId"
                        value={selectedSubject} // selected subject
                        onChange={handleUserSubjectChange} //  handleUserSubjectChange la schimbare selectie
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

                {/* <input
                    type="number"
                    id="tagId"
                    value={tagId}
                    onChange={handleTagChange}
                    placeholder="Tags ID (optional)"
                /> */}

                <button type="submit">Save</button>
            </form>
        </div>
    );
}
