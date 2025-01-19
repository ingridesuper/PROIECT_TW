import React, { useEffect, useState } from "react";
import SubjectList from "../../components/subject_components/SubjectList";

export default function EnrollSubject({ user }) {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        if (user && user.UserId) {
            fetch(`/api/subject/${user.UserId}/notEnrolled`) // materiile disponibile pentru inrolare, la care studentul nu e deja inrlat
                .then((r) => r.json())
                .then((data) => {
                    setSubjects(data || []);
                })
                .catch((error) => console.error("Error fetching subjects:", error));
        }
    }, [user]);

    const handleEnroll = (subjectId) => {
        if (user && user.UserId) {
            // cerere post pt inrolare
            fetch('/api/userSubject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    UserId: user.UserId,  
                    SubjectId: subjectId, 
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.error('Error enrolling:', data.error);
                    } else {
                        //actualizare lista materii disponibile
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
