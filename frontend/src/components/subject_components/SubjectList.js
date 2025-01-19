import React from "react";
import SubjectItem from "./SubjectItem";
import "../component_styles/Subject.css";

// folosita si pt vizualizare materii la care stud e inrolat, si pt inrolare
// in fct de props
export default function SubjectList({ subjects, canEnroll, onEnroll }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nume materie</th>
                    {canEnroll && <th>Înrolare</th>} {/* afisare buton doar daca suntem in pg inrolare */}
                </tr>
            </thead>
            <tbody>
                {Array.isArray(subjects) && subjects.length > 0 ? (
                    subjects.map((subject) => (
                        <SubjectItem 
                            key={subject.SubjectId} 
                            subject={subject} 
                            canEnroll={canEnroll} 
                            onEnroll={onEnroll}  
                        />
                    ))
                ) : (
                    <tr>
                        <td colSpan={canEnroll ? "3" : "2"}>
                            {canEnroll ? "Nu ai materii disponibile pentru înscriere." : "Nu ești înrolat la nicio materie."}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
