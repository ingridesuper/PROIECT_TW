import React from "react";
import "../component_styles/Coleg.css";

export default function ColegItem({ coleg, user, onSendNote, addingToStudyGroup, onSelectColeg }) {
    return (
        <tr>
            <td>{coleg.UserEmail}</td>
            <td>
                {addingToStudyGroup ? (
                    <button onClick={() => onSelectColeg(coleg)}>Selectează</button>
                ) : (
                    <button onClick={onSendNote}>Trimite notiță</button>
                )}
            </td>
        </tr>
    );
}
