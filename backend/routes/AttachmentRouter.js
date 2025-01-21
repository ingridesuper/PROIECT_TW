import express from "express";
import {getAttachments, getAttachmentById, createAttachment, updateAttachment, deleteAttachment, getAttachmentsOfNote, createAttachmentForNote} from "../dataAccess/AttachmentDa.js"
import multer from "multer"; //pt fisiere
import path from "path";

// Configurare multer pentru încărcarea fișierelor
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Directorul unde fișierele vor fi salvate
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Nume unic pentru fișier
    }
});

const upload = multer({ storage: storage });  // Middleware-ul multer pentru fișierele încărcate



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

attachmentRouter.route("/attachment/note/:noteId").post(upload.single('file'), async (req, res) => {
    try {
        // Creează și asociază un atașament cu o notă
        const attachment = await createAttachmentForNote(req.params.noteId, req.file);
        res.status(201).json({
            message: 'Fișierul a fost încărcat cu succes!',
            attachment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'A apărut o eroare la încărcarea fișierului.' });
    }
});

export default attachmentRouter