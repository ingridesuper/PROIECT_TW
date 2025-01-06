import UserSubject from "../entities/UserSubject.js";
import User from "../entities/User.js";
import Subject from "../entities/Subject.js"; 

//toate relatiile user-subject
async function getUserSubjects() {
    return await UserSubject.findAll();
}

//inroleaza un user la o materie
async function addUserToSubject(userId, subjectId) {
    // verificam daca utilizatorul exista
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("Utilizatorul nu există.");
    }

    // verificam daca materia exista
    const subject = await Subject.findByPk(subjectId); // Asigură-te că ai importat Subject
    if (!subject) {
        throw new Error("Materia nu există.");
    }

    // verificam daca nu e deja inrolat
    const isEnrolled = await UserSubject.findOne({
        where: { UserId: userId, SubjectId: subjectId }
    });
    if (isEnrolled) {
        throw new Error("Utilizatorul este deja înrolat la această materie.");
    }

    return await UserSubject.create({ UserId: userId, SubjectId: subjectId });
}

// obtinere toate materiile unui user
async function getSubjectsByUser(userId) {
    //validari?
    return await UserSubject.findAll({ where: { UserId: userId } });
}

// obtinere toti utilizatorii inrolati la o materie
async function getUsersBySubject(subjectId) {
    //validari?
    return await UserSubject.findAll({ where: { SubjectId: subjectId } });
}

// dez-inroleaza un user de la o materie
async function removeUserFromSubject(userId, subjectId) {
    const relation = await UserSubject.findOne({
        where: { UserId: userId, SubjectId: subjectId }
    });
    if (!relation) {
        throw new Error("Acest utilizator nu este inrolat acestei materii.");
    }
    await relation.destroy();
}

export { getUserSubjects, addUserToSubject, getSubjectsByUser, getUsersBySubject, removeUserFromSubject };
