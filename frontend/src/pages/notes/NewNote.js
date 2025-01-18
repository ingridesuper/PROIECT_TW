import React, { useState } from "react";
import "./NewNote.css"

export default function NewNote() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userSubjectId, setUserSubjectId] = useState('');
    const [tagId, setTagId] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleUserSubjectChange = (e) => {
        setUserSubjectId(e.target.value);
    };

    const handleTagChange = (e) => {
        setTagId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newNote = {
            "Title": title,
            "Content": content,
            "UserSubjectId": userSubjectId
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
                setUserSubjectId('');
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

                <input
                    type="number"
                    id="userSubjectId"
                    value={userSubjectId}
                    onChange={handleUserSubjectChange}
                    placeholder="Enter User Subject ID"
                    required
                />

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
