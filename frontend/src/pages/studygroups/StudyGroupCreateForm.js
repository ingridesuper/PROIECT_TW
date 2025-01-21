import React, { useState, useEffect } from "react";
import "./StudyGroup.css"

export default function StudyGroupCreateForm({ user }) {

    const [colegi, setColegi]=useState([])
    const [numeGrup, setNumeGrup]=useState("")

    const handleNameChange = (e) => {
        setNumeGrup(e.target.value);
    };

    return (
        <div>
            <h3>Creează propriul tău grup de studiu!</h3>
            <form>  
            <input
                type="text" 
                id="studyGroupNameTxtInput" 
                placeholder="Nume grup..."
                value={numeGrup}
                onChange={handleNameChange}
                >

            </input>

            </form>
        </div>
    )
}