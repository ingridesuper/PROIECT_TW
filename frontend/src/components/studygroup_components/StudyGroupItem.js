export default function StudyGroupItem({studyGroup }){
    return (
        // de adaugat ca par membri onSendNote
        <tr>
            <td>{studyGroup.StudyGroupName}</td>

            {/* aici user email al membrilor */}
            <td>membri</td>

            { <td><button /*onClick={onSendNote}*/>Trimite o notita</button></td> }
        </tr>
    )
}