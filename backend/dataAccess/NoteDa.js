import Note from "../entities/Note.js";
import LikeOp from "./Operators.js"
import { getUserSubjectsByUser } from "../dataAccess/UserSubjectDa.js";

//all notes
async function getNotes(){
    return await Note.findAll();
}

//notes by id
async function getNoteById(id){
    return await Note.findByPk(id);
}

//create note
//validari?
async function createNote(note){
    return await Note.create(note)
}

//update note
async function updateNote(id, noteData){
    const note=await Note.findByPk(id);
    if(!note){
        throw new Error("Notița nu a fost găsită.");
    }
    return await note.update(noteData)
}

//delete
async function deleteNote(id){
    const note=await Note.findByPk(id);
    if(!note){
        throw new Error("Notița nu a fost găsită.");
    }
    await note.destroy()
}

// //filtrare si paginare
// async function getNoteWithFilterAndPagination(filter){
  
//     if (!filter.take)
//       filter.take = 10; 

//     if (!filter.skip)
//       filter.skip = 1; 

//     let whereClause = {};
    
//     if (filter.userSubjectId){
//         whereClause.UserSubjectId = filter.userSubjectId;
//     }

//     //implementeaza aici order by date de asemenea
//     if(filter.createdAt){
//         whereClause.CreatedAt=filter.createdAt;
//     }

//     if(filter.title){
//         whereClause.Title={[LikeOp]: `%${filter.title}%`};
//     }

//     if(filter.content){
//         whereClause.Content={[LikeOp]: `%${filter.content}%`};
//     }
  
//     return await Note.findAndCountAll (
//       {   
//         distinct: true,         
//         where: whereClause,
//         limit: parseInt(filter.take),
//         offset: parseInt(filter.skip - 1) * parseInt(filter.take)
//       });
// }

//note of user
async function getNotesByUserId(userId) {
    if (!userId) {
        throw new Error("UserId este necesar.");
    }

    try {
        const userSubjects = await getUserSubjectsByUser(userId);

        if (!userSubjects || userSubjects.length === 0) {
            return []; // Utilizatorul nu are materii
        }

        const userSubjectIds = userSubjects.map((us) => us.UserSubjectId);

        const notes = await Note.findAll({
            where: {
                UserSubjectId: userSubjectIds, 
            },
        });

        return notes;
    } catch (error) {
        console.error("Eroare la obținerea notelor:", error);
        throw error;
    }
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



export {getNotes, getNoteById, createNote, updateNote, deleteNote, getNotesWithFiltersAndPagination, getNotesByUserId}