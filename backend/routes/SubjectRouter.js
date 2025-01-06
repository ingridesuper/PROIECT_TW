import express from "express";
import {getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject} from "../dataAccess/SubjectDa.js";

let subjectRouter=express.Router();

//adaugare subject nou
subjectRouter.route("/subject").post(async (req, res)=>{
    try {
        const subject = await createSubject(req.body);
        return res.status(201).json(subject);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})

//obtinere all subjects
subjectRouter.route("/subject").get(async (req, res)=>{
    return res.json(await getSubjects());
})


//obtinere subject by id
subjectRouter.route("/subject/:id").get(async (req, res)=>{
    return res.json(await getSubjectById(req.params.id));
})

// actualizare subject
subjectRouter.route("/subject/:id").put(async (req, res) => {
    return res.json(await updateSubject(req.params.id, req.body));
});

// stergere subject
subjectRouter.route("/subject/:id").delete(async (req, res) => {
    await deleteSubject(req.params.id);
    return res.status(204).send();
});

export default subjectRouter;