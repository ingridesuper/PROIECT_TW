import UserSubject from "../entities/UserSubject.js";
import User from "../entities/User.js";
import Subject from "../entities/Subject.js"; 

//de schimbat si adaugat fct pt sub pe user sau user la subject la filter and pag

//toate relatiile user-subject
async function getUserSubjects() {
    return await UserSubject.findAll();
}

async function getUserSubject(id) {
    return await UserSubject.findByPk(id);
}

//usersubject with user and subject -> gresit
async function getUserSubjectByUserAndSubject(userId, subjectId) {
    return await UserSubject.findOne({ where: { UserId: userId, SubjectId: subjectId } });
}

//inroleaza un user la o materie
async function addUserToSubject(userId, subjectId) {
    // verificam daca utilizatorul exista
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("Utilizatorul nu există.");
    }

    // verificam daca materia exista
    const subject = await Subject.findByPk(subjectId); 
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

// obtinere toate userSubject ale unui user
async function getUserSubjectsByUser(userId) {
    //validari?
    return await UserSubject.findAll({ where: { UserId: userId } });
}

// obtinere toti usersubject pt un subject
async function getUsersBySubject(subjectId) {
    //validari?
    return await UserSubject.findAll({ where: { SubjectId: subjectId } });
}

// dez-inroleaza un user de la o materie
async function removeUserFromSubject(userSubjectId) {
    const user = await UserSubject.findByPk(userSubjectId); 
    if (!user) {
        throw new Error("Acest UserSubjectId nu există.");
    }
    await user.destroy();
}

export { getUserSubjects, addUserToSubject, getUserSubjectsByUser, getUsersBySubject, removeUserFromSubject, getUserSubject, getUserSubjectByUserAndSubject };
