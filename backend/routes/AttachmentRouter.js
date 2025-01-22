import express from "express";
import {getAttachments, getAttachmentById, createAttachment, updateAttachment, deleteAttachment, getAttachmentsOfNote, createAttachmentForNote} from "../dataAccess/AttachmentDa.js"
import multer from "multer"; //pt fisiere
import path from "path";

// config multer pentru incarcare fisiere
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Directorul
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname.split(' ').join('_'); // inlocuire spatii cu "_"
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // data in format sigur pentru sistemul de fisiere
        cb(null, `${originalName}_${timestamp}${path.extname(file.originalname)}`);  // nume formatat
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // max 5 MB pe fisier
}); // middleware pt gestionare fisiere

// permite incarcarea a max 10 fis simultan
const uploadMultiple = upload.array('files', 10);


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

//un fisier
// attachmentRouter.route("/attachment/note/:noteId").post(upload.single('file'), async (req, res) => {
//     try {
//         // Creează și asociază un atașament cu o notă
//         const attachment = await createAttachmentForNote(req.params.noteId, req.file);
//         res.status(201).json({
//             message: 'Fișierul a fost încărcat cu succes!',
//             attachment
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'A apărut o eroare la încărcarea fișierului.' });
//     }
// });

//mai multe fisiere
attachmentRouter.route("/attachment/note/:noteId").post(uploadMultiple, async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Nu a fost încărcat niciun fișier.' });
        }

        const attachments = await Promise.all(
            req.files.map(async (file) => {
                return await createAttachmentForNote(req.params.noteId, file);
            })
        );

        res.status(201).json({
            message: 'Fișierele au fost încărcate cu succes!',
            attachments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'A apărut o eroare la încărcarea fișierelor.', error: error.message });
    }
});


export default attachmentRouter