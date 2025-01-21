import React, { useEffect, useState } from "react";
import StudyGroupList from "../../components/studygroup_components/StudyGroupList"

export default function StudyGroups({ user }) {
    const [studyGroupsOfUser, setStudyGroupsOfUser] = useState([])

    useEffect(() => {
        fetch(`api/studyGroup/user/${user.UserId}`)
            .then((r) => r.json())
            .then((data) => {
                setStudyGroupsOfUser(data || []);
            })
            .catch((error) => console.error("Error fetching study groups of user:", error));

    }, [user]);


    return (
        <div>
            <h3>Grupurile tale de studiu:</h3>

            <StudyGroupList studyGroups={studyGroupsOfUser} user={user}>

            </StudyGroupList>
        </div>
    )
}