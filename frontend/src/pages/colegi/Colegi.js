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

                    // obtinem materiile in care este inrolat colegul
                    fetch(`/api/subject/${selectedColeg.UserId}/subjects`)
                        .then((response) => response.json())
                        .then((subiecteColeg) => {

                            if (Array.isArray(subiecteColeg)) {

                                //vedem daca colegul e inrolat in materia notitiei
                                const isInSameSubject = subiecteColeg.some((materie) => materie.SubjectId === materieNotita.SubjectId);
                                if (isInSameSubject) {

                                    //postam notita
                                    fetch(`api/userSubject/user/${selectedColeg.UserId}/subject/${materieNotita.SubjectId}`)
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
                                } else {
                                    alert(`Colegul nu este înrolat la materia: ${materieNotita.SubjectName}`);
                                }
                            }
                        })
                })
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
