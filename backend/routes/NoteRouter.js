import express from "express";
import {getNotes, getNoteById, createNote, updateNote, deleteNote, getNoteWithFilterAndPagination, getNotesByUserId} from "../dataAccess/NoteDa.js";

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

//filtrare paginare
noteRouter.route("/note/noteFilter").get(async (req, res)=>{
    return res.json(await getNoteWithFilterAndPagination(req.query)); //query - query params din ruta
})


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

export default noteRouter;