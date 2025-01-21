import React from "react";
import ColegItem from "./ColegItem";
import "../component_styles/Coleg.css";

export default function ColegiList({ 
    user, 
    colegi, 
    onSendNote, 
    setSelectedColeg, 
    addingToStudyGroup = false, 
    onSelectColeg 
}) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>{addingToStudyGroup ? "Selectează" : "Trimite"}</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(colegi) && colegi.length > 0 ? (
                    colegi.map((coleg) => (
                        <ColegItem
                            coleg={coleg}
                            user={user}
                            key={coleg.UserId}
                            onSendNote={() => {
                                onSendNote(); 
                                setSelectedColeg(coleg); 
                            }} // setam colegul selectat

                            //daca selectam pt grup:
                            addingToStudyGroup={addingToStudyGroup}
                            onSelectColeg={onSelectColeg}
                        />
                    ))
                ) : (
                    <tr>
                        <td>Nu ai colegi.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
