import express from "express";
import {getStudyGroups, getStudyGroupById, createStudyGroup, updateStudyGroup, deleteStudyGroup, getStudyGroupWithFilterAndPagination, getStudyGroupsWhichUserIsPartOf
} from "../dataAccess/StudyGroupDa.js";

let studyGroupRouter=express.Router();

//get all
studyGroupRouter.route("/studyGroup").get(async (req, res)=>{
    return res.json(await getStudyGroups());
})

//create
studyGroupRouter.route("/studyGroup").post(async (req, res)=>{
    try {
        const studyGroup = await createStudyGroup(req.body);
        return res.status(201).json(studyGroup);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})

//getById
studyGroupRouter.route("/studyGroup/:id").get(async (req, res)=>{
    return res.json(await getStudyGroupById(req.params.id));
})

//update
studyGroupRouter.route("/studyGroup/:id").put(async (req, res)=>{
    try {
        const updatedStudyGroup = await updateStudyGroup(req.params.id, req.body);
        return res.status(200).json(updatedStudyGroup);
    } catch (error) {
        if (error.message === "Grupul nu a fost găsit.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
})

//delete
studyGroupRouter.route("/studyGroup/:id").delete(async (req, res) => {
    try {
        await deleteStudyGroup(req.params.id);
        return res.status(204).send(); 
    } catch (error) {
        if (error.message === "Grupul nu a fost găsit.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
})

//filtrare paginare
studyGroupRouter.route("/studyGroupFilter").get(async (req, res)=>{
    return res.json(await getStudyGroupWithFilterAndPagination(req.query)); 
})

studyGroupRouter.route("/studyGroup/user/:userId").get(async (req, res)=>{
    return res.json(await getStudyGroupsWhichUserIsPartOf(req.params.userId))
})

export default studyGroupRouter;