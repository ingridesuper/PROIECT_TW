import express from "express";
import { getUserStudyGroup, getUserStudyGroups, addUserToStudyGroup, removeUserFromStudyGroup, getUserStudyGroupWithFilterAndPagination} from "../dataAccess/UserStudyGroupDa.js"

let userStudyGroupRouter=express.Router();

//post
userStudyGroupRouter.route("/userStudyGroup").post(async (req, res)=>{
    try {
        const { UserId, StudyGroupId } = req.body;
        const userStudyGroup = await addUserToStudyGroup(UserId, StudyGroupId);
        return res.status(201).json(userStudyGroup);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})

//get all
userStudyGroupRouter.route("/userStudyGroup").get(async (req, res)=>{
    return res.json(await getUserStudyGroups())
})

//get by id
userStudyGroupRouter.route("/userStudyGroup/:id").get(async (req, res)=>{
    return res.json(await getUserStudyGroup(req.params.id));
})



//unenroll
userStudyGroupRouter.route("/userStudyGroup/:id").delete(async (req, res) => {
    try {
        await removeUserFromStudyGroup(req.params.id);
        return res.status(200).json({ message: "Utilizatorul a fost scos cu succes din acest grup." });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

//filtrare paginare
userStudyGroupRouter.route("/userStudyGroupFilter").get(async (req, res)=>{
    return res.json(await getUserStudyGroupWithFilterAndPagination(req.query)); 
})
export default userStudyGroupRouter;