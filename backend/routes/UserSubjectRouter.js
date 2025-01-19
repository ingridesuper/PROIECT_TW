import express from "express";
import { getUserSubjects, addUserToSubject, getUserSubjectsByUser, getUsersBySubject, removeUserFromSubject, getUserSubject } from "../dataAccess/UserSubjectDa.js"

let userSubjectRouter=express.Router();

//post
userSubjectRouter.route("/userSubject").post(async (req, res)=>{
    try {
        const { UserId, SubjectId } = req.body;
        const userSubject = await addUserToSubject(UserId, SubjectId);
        return res.status(201).json(userSubject);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})

//get all
userSubjectRouter.route("/userSubject").get(async (req, res)=>{
    return res.json(await getUserSubjects())
})

//get by id
userSubjectRouter.route("/userSubject/:id").get(async (req, res)=>{
    return res.json(await getUserSubject(req.params.id));
})

//get subjects of user
userSubjectRouter.route("/userSubject/user/:id").get(async (req, res)=>{
    return res.json(await getSubjectsByUser(req.params.id))
})

//get users enrolled in subject
userSubjectRouter.route("/userSubject/subject/:id").get(async (req, res)=>{
    return res.json(await getUsersBySubject(req.params.id))
})

//unenroll

userSubjectRouter.route("/userSubject/:id").delete(async (req, res) => {
    try {
        const userSubjectId = req.params.id;
        await removeUserFromSubject(userSubjectId);
        return res.status(200).json({ message: "Utilizatorul a fost dez-inrolat cu succes de la materie." });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

export default userSubjectRouter;