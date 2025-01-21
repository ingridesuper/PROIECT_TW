import React, { useState, useEffect } from "react";
import ColegiList from "../../components/colegi_components/ColegiList";
import "./StudyGroup.css";

export default function StudyGroupCreateForm({ user }) {
    const [colegi, setColegi] = useState([]);
    const [numeGrup, setNumeGrup] = useState("");
    const [selectedColegi, setSelectedColegi] = useState([]);

    useEffect(() => {
        if (user && user.UserId) {
            fetch(`/api/user/${user.UserId}/colegi`)
                .then((r) => r.json())
                .then((data) => {
                    setColegi(data || []);
                    console.log(colegi)
                })
                .catch((error) => console.error("Error fetching colegi:", error));
        }
    }, [user]);

    const handleNameChange = (e) => {
        setNumeGrup(e.target.value);
    };

    const handleSelectColeg = (coleg) => {
        setSelectedColegi((prevSelected) =>
            prevSelected.some((c) => c.UserId === coleg.UserId) //fara duplicate
                ? prevSelected
                : [...prevSelected, coleg]
        );
    };

    const handleCreateGroup = async () => {
        if (!numeGrup.trim()) {
            alert("Introdu un nume pentru grup.");
            return;
        }
    
        const groupData = {
            StudyGroupName: numeGrup,
        };
    
        try {
            // Creează grupul de studiu
            const response = await fetch(`/api/studyGroup`, {
                method: "POST",
                body: JSON.stringify(groupData),
                headers: { "Content-Type": "application/json" },
            });
    
            if (!response.ok) {
                throw new Error("Eroare la crearea grupului.");
            }
    
            const newGroup = await response.json();
    
            // Adaugă utilizatorul curent în grup
            const currentUserData = {
                UserId: user.UserId,
                StudyGroupId: newGroup.id,
            };
    
            const currentUserResponse = await fetch(`/api/userStudyGroup`, {
                method: "POST",
                body: JSON.stringify(currentUserData),
                headers: { "Content-Type": "application/json" },
            });
    
            if (!currentUserResponse.ok) {
                throw new Error("Eroare la adăugarea utilizatorului curent în grup.");
            }
    
            // Adaugă colegii selectați în grup
            for (const coleg of selectedColegi) {
                const memberData = {
                    UserId: coleg.UserId,
                    StudyGroupId: newGroup.id,
                };
    
                const memberResponse = await fetch(`/api/userStudyGroup`, {
                    method: "POST",
                    body: JSON.stringify(memberData),
                    headers: { "Content-Type": "application/json" },
                });
    
                if (!memberResponse.ok) {
                    throw new Error(
                        `Eroare la adăugarea colegului ${coleg.UserEmail} în grup.`
                    );
                }
            }
    
            alert("Grupul a fost creat cu succes și membrii au fost adăugați!");
            setNumeGrup("");
            setSelectedColegi([]);
        } catch (error) {
            console.error("Error:", error);
            alert("A apărut o problemă: " + error.message);
        }
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
                />
            </form>

            <h4>Selectează colegii pentru grup:</h4>

            <ColegiList
                colegi={colegi}
                user={user}
                addingToStudyGroup={true} // activare mod selectare
                onSelectColeg={handleSelectColeg} // fct de selectare
            />

            <h4 id="colegiSelectatiTitlu"> Colegi selectați:</h4>
            <ul>
                {selectedColegi.map((coleg) => (
                    <li key={coleg.UserId}>{coleg.UserEmail}</li>
                ))}
            </ul>

            <button onClick={handleCreateGroup} id="createGroupBtn">Creează grup</button>
        </div>
    );
}