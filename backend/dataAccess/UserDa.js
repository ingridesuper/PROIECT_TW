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
    // validare mail institutional
    if (!user.UserEmail || !user.UserEmail.endsWith("@stud.ase.ro")) {
        throw new Error("Email-ul trebuie să fie un cont instituțional (@stud.ase.ro)");
    }

    // validare unicitate
    const existingUser = await User.findOne({ where: { UserEmail: user.UserEmail } });
    if (existingUser) {
        throw new Error("Email-ul este deja utilizat.");
    }

    return await User.create(user);
}

export {
    getUsers,
    getUserById,
    createUser
}