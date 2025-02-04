import React from "react";
import "../component_styles/NotitePopup.css";

export default function NotitePopup({ notite, closePopup, onTrimiteNotita }) {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={closePopup}>
                    &times;
                </button>
                <h2>Notițele tale</h2>
                <br />
                <ul>
                    {notite.length > 0 ? (
                        notite.map((notita) => (
                            <li key={notita.id}>
                                <span><strong>{notita.Title}</strong> - {notita.Content.slice(0, 30)}...</span>
                                <button onClick={() => onTrimiteNotita(notita)}>Trimite</button>
                            </li>
                        ))
                    ) : (
                        <p>Nu ai nicio notiță.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}
