import Subject from "../entities/Subject.js";
import UserSubject from "../entities/UserSubject.js";
import User from "../entities/User.js";
import LikeOp from "./Operators.js"
import {getUserSubjectsByUser} from "./UserSubjectDa.js"
import { Op } from "sequelize";


async function getSubjects(){
    return await Subject.findAll()
}

async function getSubjectById(id){
    return await Subject.findByPk(id)
}

async function createSubject(subject){
    if (!subject.SubjectName) {
        throw new Error("Numele materiei este obligatoriu.");
    }
    return await Subject.create(subject);
}

async function updateSubject(id, subjectData) {
    const subject = await Subject.findByPk(id);
    if (!subject) {
        throw new Error("Materia nu a fost găsită.");
    }
    return await subject.update(subjectData);
}

async function deleteSubject(id) {
    const subject = await Subject.findByPk(id);
    if (!subject) {
        throw new Error("Materia nu a fost găsită.");
    }
    await subject.destroy();
}

//adaugat
async function getUsersOfSubjectBySubjectId(subjectId){
    let subject=await getSubjectById(subjectId)
    return await subject.getUsers() //fct sequelize
}

//modificat
async function getSubjectsByUser(userId){
    const user=await User.findByPk(userId)
    if (!user) throw new Error(`User with ID ${userId} not found`);
    return await user.getSubjects()
}

async function getSubjectsNotEnrolledByUser(userId) {
    const userSubjects = await getUserSubjectsByUser(userId);
    const subjectIds = userSubjects.map(userSubject => userSubject.SubjectId);

    if (subjectIds.length === 0) {
        return await getSubjects();
    }

    return await Subject.findAll({
        where: {
            SubjectId: {
                [Op.notIn]: subjectIds 
            }
        }
    });
}

//filtrare si paginare
async function getSubjectWithFilterAndPagination(filter){
  
    if (!filter.take)
      filter.take = 10; 

    if (!filter.skip)
      filter.skip = 1; 

    let whereClause = {};
    
    if (filter.subjectName){
        whereClause.SubjectName = {[LikeOp]: `%${filter.subjectName}%`};
    }

    if(filter.subjectDescription){
        whereClause.SubjectDescription = {[LikeOp]: `%${filter.subjectDescription}%`};
    }
  
  
    return await Subject.findAndCountAll (
      {   
        distinct: true,         
        where: whereClause,
        limit: parseInt(filter.take),
        offset: parseInt(filter.skip - 1) * parseInt(filter.take)
      });
}


export {
    getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject, getSubjectWithFilterAndPagination, getSubjectsByUser, getSubjectsNotEnrolledByUser, getUsersOfSubjectBySubjectId
}