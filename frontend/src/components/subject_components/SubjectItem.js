export default function SubjectItem({ subject, canEnroll, onEnroll }) {
    return (
        <tr>
            <td>{subject.SubjectId}</td>
            <td>{subject.SubjectName}</td>
            {canEnroll && (
                <td>
                    <button onClick={() => onEnroll(subject.SubjectId)}>Înscrie-te</button>
                </td>
            )}
        </tr>
    );
}
