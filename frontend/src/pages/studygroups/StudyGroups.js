import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

import StudyGroupList from "../../components/studygroup_components/StudyGroupList";
import NotitePopup from "../../components/note_components/NotitePopup";

export default function StudyGroups({ user }) {
    const [studyGroupsOfUser, setStudyGroupsOfUser] = useState([]);
    const [selectedStudyGroup, setSelectedStudyGroup] = useState(null);
    const [userNotite, setUserNotite] = useState([]);

    const [isNotiteVisible, setNotiteVisible] = useState(false);

    useEffect(() => {
        fetch(`/api/studyGroup/user/${user.UserId}`)
            .then((r) => r.json())
            .then((data) => {
                setStudyGroupsOfUser(data || []);
            })
            .catch((error) => console.error("Error fetching study groups of user:", error));
    }, [user]);

    useEffect(() => {
        fetch(`/api/note/user/${user.UserId}`)
            .then((r) => r.json())
            .then((data) => {
                setUserNotite(data || []);
            })
            .catch((error) => console.error("Error fetching notite:", error));
    }, [user]);

    const toggleNotitePopup = () => {
        setNotiteVisible(!isNotiteVisible);
    };

    const onTrimiteNotitaToGroup = (notita) => {
        if (selectedStudyGroup) {
            // obt membri grup selectat
            fetch(`/api/studyGroup/${selectedStudyGroup.id}/members`)
                .then((response) => response.json())
                .then((membri) => {
                    // excludere utilizator curent
                    const membriExclusUser = membri.filter((membru) => membru.UserId !== user.UserId);
        
                    // obt materia notitei
                    fetch(`/api/note/${notita.id}/getSubjectOfNote`)
                        .then((response) => response.json())
                        .then((materieNotita) => {
                            const colegiNeinscrisi = [];
                            const colegiEligibili = [];
        
                            // verifica inscrierea fiecarui membru
                            Promise.all(
                                membriExclusUser.map((membru) =>
                                    fetch(`/api/subject/${membru.UserId}/subjects`)
                                        .then((response) => response.json())
                                        .then((subiecteMembru) => {
                                            const isInSameSubject = subiecteMembru.some(
                                                (materie) => materie.SubjectId === materieNotita.SubjectId
                                            );
                                            if (isInSameSubject) {
                                                colegiEligibili.push(membru);
                                            } else {
                                                colegiNeinscrisi.push(membru.UserEmail);
                                            }
                                        })
                                )
                            ).then(() => {
                                if (colegiNeinscrisi.length > 0) {
                                    const confirmSend = window.confirm(
                                        `Colegii ${colegiNeinscrisi.join(
                                            ", "
                                        )} nu sunt înrolați la materia ${materieNotita.SubjectName}. Doriți să trimiteți notița celorlalți membri?`
                                    );
        
                                    if (!confirmSend) {
                                        return;
                                    }
                                }
        
                                // trm notita catre colegii eligibili
                                colegiEligibili.forEach((membru) => {
                                    fetch(`api/userSubject/user/${membru.UserId}/subject/${materieNotita.SubjectId}`)
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
                                                .then((noteResponse) => noteResponse.json())
                                                .then((createdNote) => {
                                                    
                                                    // atasam atasamentele
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
                                                                    console.log("Toate atașamentele au fost trimise.");
                                                                })
                                                                .catch((error) => {
                                                                    console.error("Eroare la trimiterea atașamentelor:", error);
                                                                });
                                                        })
                                                        .catch((error) => {
                                                            console.error("Eroare la obținerea atașamentelor:", error);
                                                        });
                                                })
                                                .catch((error) => {
                                                    console.error("Error sending notita:", error);
                                                });
                                        });
                                });
        
                                alert("Notița a fost trimisă!");
                            });
                        });
                })
                .catch((error) => console.error("Error fetching study group members:", error));
        }
    };
    
    

    return (
        <div>
            <h3>Grupurile tale de studiu:</h3>
            
            {/* link to create a new study group */}
            <Link to="./new" user={user}> 
                <button className="fab">+</button>
            </Link>

            <StudyGroupList
                studyGroups={studyGroupsOfUser}
                user={user}
                setSelectedStudyGroup={setSelectedStudyGroup}
                onSendNote={toggleNotitePopup}
            />

            {isNotiteVisible && (
                <NotitePopup
                    notite={userNotite}
                    closePopup={toggleNotitePopup}
                    onTrimiteNotita={onTrimiteNotitaToGroup}
                />
            )}
        </div>
    );
}