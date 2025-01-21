import React, { useEffect, useState } from "react";
import ColegiList from "../../components/colegi_components/ColegiList";
import NotitePopup from "../../components/note_components/NotitePopup";
import "../../components/component_styles/Coleg.css"

export default function Colegi({ user }) {
    const [colegi, setColegi] = useState([]);
    const [isNotiteVisible, setNotiteVisible] = useState(false);
    const [userNotite, setUserNotite] = useState([]);
    const [selectedColeg, setSelectedColeg] = useState(null);
    const [emailFilter, setEmailFilter] = useState("");


    useEffect(() => {
        if (user && user.UserId) {
            fetch(`api/user/${user.UserId}/colegi`)
                .then((r) => r.json())
                .then((data) => {
                    setColegi(data || []);
                })
                .catch((error) => console.error("Error fetching colegi:", error));

            fetch(`/api/note/user/${user.UserId}`)
                .then((r) => r.json())
                .then((data) => {
                    setUserNotite(data || []);
                })
                .catch((error) => console.error("Error fetching notite:", error));
        }
    }, [user]);

    const toggleNotitePopup = () => {
        setNotiteVisible(!isNotiteVisible);
    };

    const handleEmailFilterChange = (e) => {
        setEmailFilter(e.target.value.toLowerCase()); 
    };

  
    const onTrimiteNotita = (notita) => {
        if (selectedColeg) {
            // sub notita
            fetch(`/api/note/${notita.id}/getSubjectOfNote`)
                .then((response) => response.json())
                .then((materieNotita) => {
                    // mat la care e inrolat colegul
                    fetch(`/api/subject/${selectedColeg.UserId}/subjects`)
                        .then((response) => response.json())
                        .then((subiecteColeg) => {
                            if (Array.isArray(subiecteColeg)) {
                                // check if  colegul este inrolat la materia notitei
                                const isInSameSubject = subiecteColeg.some(
                                    (materie) => materie.SubjectId === materieNotita.SubjectId
                                );
    
                                if (isInSameSubject) {
                                    // obt subjectid
                                    fetch(`/api/userSubject/user/${selectedColeg.UserId}/subject/${materieNotita.SubjectId}`)
                                        .then((response) => response.json())
                                        .then((userSubject) => {
                                            // creare notita
                                            const newNote = {
                                                Title: notita.Title,
                                                Content: notita.Content,
                                                UserSubjectId: userSubject.UserSubjectId,
                                            };
    
                                            fetch(`/api/note`, {
                                                method: "POST",
                                                body: JSON.stringify(newNote),
                                                headers: { "Content-Type": "application/json" },
                                            })
                                                .then((response) => response.json())
                                                .then((createdNote) => {

                                                    // asociere atasamente
                                                    fetch(`/api/attachment/note/${notita.id}`)
                                                        .then((response) => response.json())
                                                        .then((attachments) => {

                                                            const attachmentPromises = attachments.map((attachment) => {
                                                                const newAttachment = {
                                                                    FileName: attachment.FileName,
                                                                    FilePath: attachment.FilePath,
                                                                    FileType: attachment.FileType,
                                                                    NoteId: createdNote.id, 
                                                                };
    
                                                                return fetch(`/api/attachment`, {
                                                                    method: "POST",
                                                                    body: JSON.stringify(newAttachment),
                                                                    headers: { "Content-Type": "application/json" },
                                                                });
                                                            });
    
                                                            Promise.all(attachmentPromises)
                                                                .then(() => {
                                                                    alert("Notița a fost trimisă cu succes!");
                                                                    setNotiteVisible(false);
                                                                })
                                                        })
                                                })
                                                .catch((error) => {
                                                    console.error("Error creating notita:", error);
                                                    alert("Nu s-a putut trimite notița.");
                                                });
                                        });
                                } else {
                                    alert(`${selectedColeg.UserEmail} nu este înrolat la materia ${materieNotita.SubjectName}`);
                                }
                            }
                        });
                });
        }
    };
    

    const filteredColegi = colegi.filter((coleg) =>
        coleg.UserEmail.toLowerCase().includes(emailFilter)
    );

    return (
        <div>
            <h3>Colegi</h3>

            {/* filter mail */}
            <div className="filter-email">
                <input
                    type="text"
                    placeholder="Caută după email..."
                    value={emailFilter}
                    onChange={handleEmailFilterChange}
                />
            </div>

            {/* lista colegi */}
            <ColegiList
                user={user}
                colegi={filteredColegi}
                onSendNote={toggleNotitePopup}
                setSelectedColeg={setSelectedColeg}
            />

            {/* popup notite */}
            {isNotiteVisible && (
                <NotitePopup
                    notite={userNotite}
                    closePopup={toggleNotitePopup}
                    onTrimiteNotita={onTrimiteNotita}
                />
            )}
        </div>
    );
}