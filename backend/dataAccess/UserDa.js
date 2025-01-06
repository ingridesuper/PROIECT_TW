import User from "../entities/User.js";
import Subject from "../entities/Subject.js";

async function getUsers(){
    //return await User.findAll({include: ["Subjects"]})
    return await User.findAll()
}

async function getUserById(id){
    //return await User.findByPk(id, {include: ["Subjects"]})
    return await User.findByPk(id)
}

async function createUser(user){
    //adauga validare aici
    return await User.create(user)
}

export {
    getUsers,
    getUserById,
    createUser
}