import User from "../entities/User.js";
import Subject from "../entities/Subject.js";

async function getSubjects(){
    return await Subject.findAll()
}

async function getSubjectById(id){
    return await Subject.findByPk(id)
}

async function createSubject(subject){
    if (!subject.SubjectName) {
        throw new Error("Numele materiei este obligatoriu.");
    }
    return await Subject.create(subject);
}

async function updateSubject(id, subjectData) {
    const subject = await Subject.findByPk(id);
    if (!subject) {
        throw new Error("Materia nu a fost găsită.");
    }
    return await subject.update(subjectData);
}

async function deleteSubject(id) {
    const subject = await Subject.findByPk(id);
    if (!subject) {
        throw new Error("Materia nu a fost găsită.");
    }
    await subject.destroy();
}

export {
    getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject
}