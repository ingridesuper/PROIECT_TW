import express from "express";
import {getUsers, getUserById, createUser} from "../dataAccess/UserDa.js";

let userRouter=express.Router();

userRouter.route("/user").post(async (req, res)=>{
    return res.status(201).json(await createUser(req.body));
})


userRouter.route("/user").get(async (req, res)=>{
    return res.json(await getUsers());
})


userRouter.route("/user/:id").get(async (req, res)=>{
    return res.json(await getUserById(req.params.id));
})

export default userRouter;