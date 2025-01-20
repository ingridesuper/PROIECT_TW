import Note from "../entities/Note.js";
import User from "../entities/User.js"
import LikeOp from "./Operators.js"
import { getUserSubjectsByUser, getUserSubjectByUserAndSubject } from "../dataAccess/UserSubjectDa.js";
import UserSubject from "../entities/UserSubject.js";

//all notes
async function getNotes() {
    return await Note.findAll();
}

//notes by id
async function getNoteById(id) {
    return await Note.findByPk(id);
}

//create note
//validari?
async function createNote(note) {
    return await Note.create(note)
}

//update note
async function updateNote(id, noteData) {
    const note = await Note.findByPk(id);
    if (!note) {
        throw new Error("Notița nu a fost găsită.");
    }
    return await note.update(noteData)
}

//delete
async function deleteNote(id) {
    const note = await Note.findByPk(id);
    if (!note) {
        throw new Error("Notița nu a fost găsită.");
    }
    await note.destroy()
}

//get all notes of a specific user -> am modificat
async function getNotesByUserId(userId) {
    const userSubjects=await getUserSubjectsByUser(userId); //rez array; fct merge pe object
    let notes=[];
    for(let userSubject of userSubjects){
        for(let note of await userSubject.getUserSubjectNotes()){   //aici folosim alias-ul!
            notes.push(note);
        }
    }
    return notes;
}

//cu tot cu userId inclus
async function getNotesWithFiltersAndPagination(userId, filter = {}) {

    let whereClause = {};

    if (userId) {
        const userSubjects = await getUserSubjectsByUser(userId);

        if (!userSubjects || userSubjects.length === 0) {
            return [];
        }

        const userSubjectIds = userSubjects.map((us) => us.UserSubjectId);
        whereClause.UserSubjectId = userSubjectIds; // Adăugăm filtru pe UserSubjectId
    }

    if (filter.createdAt) {
        whereClause.CreatedAt = filter.createdAt;
    }

    if (filter.title) {
        whereClause.Title = { [LikeOp]: `%${filter.title}%` }; // Filtru pe titlu
    }

    if (filter.content) {
        whereClause.Content = { [LikeOp]: `%${filter.content}%` }; // Filtru pe conținut
    }

    try {
        const notes = await Note.findAndCountAll({
            distinct: true,
            where: whereClause,
            limit: parseInt(filter.take),
            offset: (parseInt(filter.skip) - 1) * parseInt(filter.take),
        });

        return notes;
    } catch (error) {
        console.error("Eroare la obținerea notelor:", error);
        throw error;
    }
}

//get notes of user for specific subject-> am modificat
async function getNotesByUserSubjectId(userId,  subjectId) {
    const userSubject=await getUserSubjectByUserAndSubject(userId, subjectId);
    return await userSubject.getUserSubjectNotes()

}



export { getNotes, getNoteById, createNote, updateNote, deleteNote, getNotesWithFiltersAndPagination, getNotesByUserId, getNotesByUserSubjectId }