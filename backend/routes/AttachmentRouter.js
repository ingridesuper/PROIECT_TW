import express from "express";
import {getAttachments, getAttachmentById, createAttachment, updateAttachment, deleteAttachment, getAttachmentsOfNote} from "../dataAccess/AttachmentDa.js"

let attachmentRouter=express.Router();

attachmentRouter.route("/attachment").get(async (req, res)=>{
    return res.json(await getAttachments());
})

attachmentRouter.route("/attachment/:attachmentId").get(async (req, res)=>{
    return res.json(await getAttachmentById(req.params.attachmentId));
})

attachmentRouter.route("/attachment").post(async (req, res)=>{
    return res.status(201).json(await createAttachment(req.body));
})

attachmentRouter.route("/attachment/:attachmentId").put(async (req, res) => {
    try {
        const updatedAttachment = await updateAttachment(req.params.attachmentId, req.body);
        return res.status(200).json(updatedAttachment);
    } catch (error) {
        if (error.message === "Attachment-ul nu a fost găsit.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
});


attachmentRouter.route("/attachment/:attachmentId").delete(async (req, res) => {
    try {
        await deleteAttachment(req.params.attachmentId);
        return res.status(204).send(); //aka no content
    } catch (error) {
        if (error.message === "Attachment-ul nu a fost găsit.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
});

attachmentRouter.route("/attachment/note/:noteId").get(async (req, res)=>{
    const attachments = await getAttachmentsOfNote(req.params.noteId);
    return res.json(attachments);
});

export default attachmentRouter