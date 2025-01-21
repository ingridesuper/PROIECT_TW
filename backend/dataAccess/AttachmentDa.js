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

export {getAttachments, getAttachmentById, createAttachment, updateAttachment, deleteAttachment, getAttachmentsOfNote}