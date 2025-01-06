import express from "express";
import {getUsers, getUserById, createUser} from "../dataAccess/UserDa.js";

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

export default userRouter;