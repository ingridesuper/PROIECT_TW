import express from "express";
import {getNotes, getNoteById, createNote, updateNote, deleteNote, getNotesWithFiltersAndPagination, getNotesByUserId, getNotesByUserSubjectId, getUserSubjectByNote, getSubjectOfNote} from "../dataAccess/NoteDa.js";

let noteRouter=express.Router();

//get all
noteRouter.route("/note").get(async (req, res)=>{
    return res.json(await getNotes());
})

//create
noteRouter.route("/note").post(async (req, res)=>{
    try {
        const note = await createNote(req.body);
        return res.status(201).json(note);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})

//getById
noteRouter.route("/note/:id").get(async (req, res)=>{
    return res.json(await getNoteById(req.params.id));
})

//update
noteRouter.route("/note/:id").put(async (req, res)=>{
    try {
        const updatedNote = await updateNote(req.params.id, req.body);
        return res.status(200).json(updatedNote);
    } catch (error) {
        if (error.message === "Notița nu a fost găsită.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
})

//delete
noteRouter.route("/note/:id").delete(async (req, res) => {
    try {
        await deleteNote(req.params.id);
        return res.status(204).send(); 
    } catch (error) {
        if (error.message === "Notița nu a fost găsită.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
})


noteRouter.get('/note/noteFilter/:userId', async (req, res) => {
    try {
        const { userId } = req.params;  // Folosim userId din parametrii rutei
        const { take, skip, title, content, createdAt } = req.query;

        const filter = {
            take: take ? parseInt(take) : 10,  
            skip: skip ? parseInt(skip) : 1,     
            title: title || undefined,           
            content: content || undefined,        
            createdAt: createdAt || undefined,    
        };

        const notes = await getNotesWithFiltersAndPagination(userId, filter);

        res.json(notes);
    } catch (error) {
        console.error('Eroare la obținerea notelor:', error);
        res.status(500).json({ error: 'A apărut o eroare la obținerea notelor.' });
    }
});

//notes of user
noteRouter.route("/note/user/:userId").get(async (req, res) => {
    try {
        const { userId } = req.params;
        const notes = await getNotesByUserId(userId);
        return res.status(200).json(notes);
    } catch (error) {
        console.error("Eroare la obținerea notelor pentru utilizator:", error);
        return res.status(500).json({ error: "A apărut o eroare la procesarea cererii." });
    }
});

//notes of user for subject
noteRouter.route("/note/user/:userId/subject/:subjectId").get(async (req, res) => {
    try {
        const notes = await getNotesByUserSubjectId(req.params.userId, req.params.subjectId);
        res.json(notes);
    } catch (error) {
        console.error("Eroare la obținerea notelor:", error);
        res.status(500).send("Eroare la obținerea notelor");
    }
});

//user subject entity of note
noteRouter.route("/note/:noteId/getUserSubject").get(async (req, res)=>{
    const userSubject=await getUserSubjectByNote(req.params.noteId);
    return res.json(userSubject)
})

//subject entity of note
noteRouter.route("/note/:noteId/getSubjectOfNote").get(async (req, res)=>{
    const subject=await getSubjectOfNote(req.params.noteId)
    return res.json(subject)
})

export default noteRouter;