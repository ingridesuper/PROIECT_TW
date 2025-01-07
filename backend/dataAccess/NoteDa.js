import Note from "../entities/Note.js";
import LikeOp from "./Operators.js"

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

//filtrare si paginare
async function getNoteWithFilterAndPagination(filter){
  
    if (!filter.take)
      filter.take = 10; 

    if (!filter.skip)
      filter.skip = 1; 

    let whereClause = {};
    
    if (filter.userId){
        whereClause.UserId = filter.userId;
    }

    if(filter.subjectId){
        whereClause.SubjectId =filter.subjectId;
    }

    //implementeaza aici order by date de asemenea
    if(filter.createdAt){
        whereClause.CreatedAt=filter.createdAt;
    }

    if(filter.title){
        whereClause.Title={[LikeOp]: `%${filter.title}%`};
    }

    if(filter.content){
        whereClause.Content={[LikeOp]: `%${filter.content}%`};
    }
  
    return await Note.findAndCountAll (
      {   
        distinct: true,         
        where: whereClause,
        limit: parseInt(filter.take),
        offset: parseInt(filter.skip - 1) * parseInt(filter.take)
      });
}

export {getNotes, getNoteById, createNote, updateNote, deleteNote, getNoteWithFilterAndPagination}