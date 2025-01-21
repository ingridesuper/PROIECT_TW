import express from "express";
import {getUsers, getUserById, createUser, getUserWithFilterAndPagination, getColegiOfUser} from "../dataAccess/UserDa.js";

let userRouter=express.Router();

userRouter.route("/user").post(async (req, res)=>{
    try {
        const user = await createUser(req.body);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})


userRouter.route("/user").get(async (req, res)=>{
    return res.json(await getUsers());
})


userRouter.route("/user/:id").get(async (req, res)=>{
    return res.json(await getUserById(req.params.id));
})

userRouter.route("/user/:userId/colegi").get(async (req, res)=>{
    return res.json(await getColegiOfUser(req.params.userId));
})

//filtrat si paginat
userRouter.route("/userFilter").get(async (req, res)=>{
    return res.json(await getUserWithFilterAndPagination(req.query)); //query - query params din ruta
})
//asa arata ruta de ex pt mailuri care contin ingrid
//http://localhost:9000/api/userFilter?userEmail=ingrid
//si pt paginare
//http://localhost:9000/api/userFilter?userEmail=ingrid&take=1
//pt skip
//http://localhost:9000/api/userFilter?userEmail=ingrid&take=1&skip=1

export default userRouter;