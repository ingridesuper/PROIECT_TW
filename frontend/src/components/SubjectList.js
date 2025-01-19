// SubjectList.js
import React from "react";
import SubjectItem from "./SubjectItem";
import "./component_styles/Subject.css";

export default function SubjectList({ subjects, canEnroll, onEnroll }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nume materie</th>
                    {canEnroll && <th>Înrolare</th>} {/* afișează buton doar dacă suntem în pagină de înrolare */}
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
