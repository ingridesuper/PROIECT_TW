import React from "react";
import "../component_styles/Coleg.css";

export default function ColegItem({ coleg, user, onSendNote }) {
    return (
        <tr>
            <td>{coleg.UserEmail}</td>
            <td>
                <button onClick={onSendNote}>Trimite notiță</button>
            </td>
        </tr>
    );
}
