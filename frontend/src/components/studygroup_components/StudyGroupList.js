import React from "react";
import StudyGroupItem from "./StudyGroupItem";

export default function StudyGroupList({studyGroups, user, setSelectedStudyGroup, onSendNote}){
    return (
        <table>
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Membri</th>
                            <th>Trimite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(studyGroups) && studyGroups.length > 0 ? (
                            studyGroups.map((studyGroup) => (
                                <StudyGroupItem
                                    studyGroup={studyGroup}
                                    user={user}
                                    key={studyGroup.id}
                                    onSendNote={() => {
                                        onSendNote(); 
                                        setSelectedStudyGroup(studyGroup); 
                                    }} 
                                />
                            ))
                        ) : (
                            <tr>
                                <td>Nu faci parte din niciun grup de studiu.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
    )
}