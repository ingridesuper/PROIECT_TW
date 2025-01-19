import React, { useEffect, useState } from "react";
import SubjectList from "../../components/subject_components/SubjectList";
import { Link } from "react-router-dom";

export default function Subjects({ user }) {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        if (user && user.UserId) {
            fetch(`api/subject/${user.UserId}/subjects`) 
                .then((r) => r.json())
                .then((data) => {
                    setSubjects(data || []);
                })
                .catch((error) => console.error("Error fetching subjects:", error));
        }
    }, [user]);

    return (
        <div>
            <h3>Materiile tale:</h3>
            <SubjectList subjects={subjects} canEnroll={false} /> 
            <Link to="./enroll">
                <button>
                    Adaugă materii
                </button>
            </Link>
        </div>
    );
}
