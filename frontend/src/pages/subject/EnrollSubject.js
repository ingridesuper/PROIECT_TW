import React, { useEffect, useState } from "react";
import SubjectList from "../../components/SubjectList";

export default function EnrollSubject({ user }) {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        if (user && user.UserId) {
            fetch(`/api/subject/${user.UserId}/notEnrolled`) // Materiile disponibile pentru înrolare
                .then((r) => r.json())
                .then((data) => {
                    setSubjects(data || []);
                })
                .catch((error) => console.error("Error fetching subjects:", error));
        }
    }, [user]);

    const handleEnroll = (subjectId) => {
        if (user && user.UserId) {
            // Trimiterea cererii POST către server pentru a înrola utilizatorul la materie
            fetch('/api/userSubject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    UserId: user.UserId,  // ID-ul utilizatorului
                    SubjectId: subjectId, // ID-ul materiei
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.error('Error enrolling:', data.error);
                    } else {
                        // Dacă înrolarea este cu succes, actualizează lista de materii disponibile
                        setSubjects(subjects.filter((subject) => subject.SubjectId !== subjectId));
                    }
                })
                .catch((error) => console.error("Error enrolling:", error));
        }
    };

    return (
        <div>
            <h3>Materii disponibile pentru înrolare:</h3>
            <SubjectList subjects={subjects} canEnroll={true} onEnroll={handleEnroll} />
        </div>
    );
}
