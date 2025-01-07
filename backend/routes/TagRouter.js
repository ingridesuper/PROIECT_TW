import express from "express";
import {getTags, getTagById, createTag, updateTag, deleteTag, getTagWithFilterAndPagination} from "../dataAccess/TagDa.js";

let tagRouter=express.Router();

tagRouter.route("/tag").get(async (req, res)=>{
    return res.json(await getTags());
})

tagRouter.route("/tag/:id").get(async (req, res) => {
    return res.json(await getTagById(req.params.id));
});

tagRouter.route("/tag").post(async (req, res) => {
    return res.status(201).json(await createTag(req.body));
});

tagRouter.route("/tag/:id").put(async (req, res) => {
    try {
        const updatedTag = await updateTag(req.params.id, req.body);
        return res.status(200).json(updatedTag);
    } catch (error) {
        if (error.message === "Tag-ul nu a fost găsit.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
});

tagRouter.route("/tag/:id").delete(async (req, res) => {
    try {
        await deleteTag(req.params.id);
        return res.status(204).send(); //aka no content
    } catch (error) {
        if (error.message === "Tag-ul nu a fost găsit.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
});

tagRouter.route("/tagFilter").get(async (req, res) => {
    return res.json(await getTagWithFilterAndPagination(req.query));
});

export default tagRouter;