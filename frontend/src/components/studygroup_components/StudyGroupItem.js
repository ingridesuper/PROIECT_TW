import React, { use, useEffect, useState } from "react";

export default function StudyGroupItem({studyGroup, onSendNote }){
    const [membri, setMembri]=useState([])
    
    useEffect(() => {
            fetch(`api/studyGroup/${studyGroup.id}/members`)
                .then((r) => r.json())
                .then((data) => {
                    setMembri(data || []);
                })
                .catch((error) => console.error("Error fetching members of study group:", error));
    
        }, [studyGroup]);

    return (
        <tr>
            <td>{studyGroup.StudyGroupName}</td>

            <td>
                {membri.length > 0
                    ? membri.map((membru) => membru.UserEmail).join(", ")
                    : "Fără membri"}
            </td>

            { <td><button onClick={onSendNote}>Trimite o notita</button></td> }
        </tr>
    )
}