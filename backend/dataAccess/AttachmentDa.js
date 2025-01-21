import Attachment from "../entities/Attachment.js";
import Note from "../entities/Note.js";

//get all
async function getAttachments(){
    return await Attachment.findAll();
}

//get by id
async function getAttachmentById(attachmentId){
    return await Attachment.findByPk(attachmentId);
}

//create
async function createAttachment(attachment){
    return await Attachment.create(attachment);
}

//update
async function updateAttachment(id, attachmentData) {
    const attachment = await Attachment.findByPk(id);
    if (!attachment) {
        throw new Error("Attachment-ul nu a fost gasit.");
    }
    return await attachment.update(attachmentData)
}

//delete
async function deleteAttachment(id) {
    const attachment = await Attachment.findByPk(id);
    if (!attachment) {
        throw new Error("Attachment-ul nu a fost gasit.");
    }
    await attachment.destroy()
}

//get attachments of note
async function getAttachmentsOfNote(noteId){
    const note = await Note.findByPk(noteId);
    if (!note) {
        throw new Error("Notița nu a fost găsită.");
    }
    return await note.getAttachments();
}



//new:
// Create and associate an attachment with a note
async function createAttachmentForNote(noteId, file) {
    const note = await Note.findByPk(noteId);
    if (!note) {
        throw new Error("Notița nu a fost găsită.");
    }

    const attachment = await Attachment.create({
        NoteId: noteId,
        FilePath: file.path,  // Calea fișierului încărcat
        FileName: file.filename,  // Numele fișierului
        FileType: file.mimetype,  // Tipul fișierului
    });

    return attachment;
}

export {getAttachments, getAttachmentById, createAttachment, updateAttachment, deleteAttachment, getAttachmentsOfNote, createAttachmentForNote}