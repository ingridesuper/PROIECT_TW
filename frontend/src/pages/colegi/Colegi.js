import React, { useEffect, useState } from "react";
import ColegiList from "../../components/colegi_components/ColegiList";
import NotitePopup from "../../components/note_components/NotitePopup";

export default function Colegi({ user }) {
    const [colegi, setColegi] = useState([]);
    const [isNotiteVisible, setNotiteVisible] = useState(false);
    const [userNotite, setUserNotite] = useState([]);
    const [selectedColeg, setSelectedColeg] = useState(null);

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

    const onTrimiteNotita = (notita) => {
        if (selectedColeg) {
            // obtinem subiectul notitei
            fetch(`/api/note/${notita.id}/getSubjectOfNote`)
                .then((response) => response.json())
                .then((materieNotita) => {
                    // obținem materiile în care este înrolat colegul
                    console.log(`Materie notitta is: ${materieNotita.SubjectId}`);
                    fetch(`/api/subject/${selectedColeg.UserId}/subjects`)
                        .then((response) => response.json())
                        .then((subiecteColeg) => {

                            if (Array.isArray(subiecteColeg)) {
                                const isInSameSubject = subiecteColeg.some((materie) => materie.SubjectId === materieNotita.SubjectId);
                                if (isInSameSubject) {
                                    console.log(`${selectedColeg.UserId}`)
                                    fetch(`api//userSubject/user/${selectedColeg.UserId}/subject/${materieNotita.SubjectId}`)
                                        .then((userSubjectResponse) => userSubjectResponse.json())
                                        .then((userSubject) => {
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
                                                .then((r) => r.json())
                                                .then((data) => {
                                                    alert("Notița a fost trimisă cu succes!");
                                                    setNotiteVisible(false);
                                                })
                                                .catch((error) => {
                                                    console.error("Error sending notita:", error);
                                                });
                                        })
                                        .catch((error) => {
                                            console.error("Error fetching user subject:", error);
                                        });
                                } else {
                                    alert(`Colegul nu este înrolat la materia: ${materieNotita.SubjectName}`);
                                }
                            } else {
                                console.error("A apărut o eroare: subiectele colegului nu sunt într-un array.");
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching subjects of coleg:", error);
                        });
                })
                .catch((error) => {
                    console.error("Error fetching subject of note:", error);
                });
        }
    };

    return (
        <div>
            <h3>Colegi</h3>
            <ColegiList
                user={user}
                colegi={colegi}
                onSendNote={toggleNotitePopup}
                setSelectedColeg={setSelectedColeg}
            />

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
