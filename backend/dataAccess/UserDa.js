import User from "../entities/User.js";
import Subject from "../entities/Subject.js";
import { Op as LikeOp } from "sequelize";

async function getUsers() {
  return await User.findAll()
}

async function getUserById(id) {
  return await User.findByPk(id)
}

//pt autentificare
async function getUserByEmail(email) {
  return await User.findOne({ where: { UserEmail: email } });
}

//create user
async function createUser(user) {
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

//filtrare si paginare
async function getUserWithFilterAndPagination(filter) {

  if (!filter.take)
    filter.take = 10; //primele 10

  if (!filter.skip)
    filter.skip = 1; //pe prima pagina

  let whereClause = {};
  if (filter.userEmail)
    whereClause.UserEmail = { [LikeOp]: `%${filter.userEmail}%` };


  return await User.findAndCountAll(
    {
      distinct: true,
      where: whereClause,
      limit: parseInt(filter.take),
      offset: parseInt(filter.skip - 1) * parseInt(filter.take)
    });
}

//colegi 
async function getColegiOfUser(userId) {
  return await User.findAll({
    where: {
      UserId: { [LikeOp.ne]: userId }, // exclude utilizatorul curent
    },
  });
}

export {
  getUsers,
  getUserById,
  createUser,
  getUserWithFilterAndPagination,
  getUserByEmail,
  getColegiOfUser
}