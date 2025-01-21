import StudyGroup from "../entities/StudyGroup.js";
import LikeOp from "./Operators.js"
import User from "../entities/User.js";


async function getStudyGroups(){
    return await StudyGroup.findAll();
}

async function getStudyGroupById(id){
    return await StudyGroup.findByPk(id)
}

async function createStudyGroup(studyGroup){
    if (!studyGroup.StudyGroupName) {
        throw new Error("Numele grupului este obligatoriu.");
    }
    return await StudyGroup.create(studyGroup);
}

async function updateStudyGroup(id, studyGroupData) {
    const studyGroup = await StudyGroup.findByPk(id);
    if (!studyGroup) {
        throw new Error("Grupul nu a fost găsit.");
    }
    return await studyGroup.update(studyGroupData);
}

async function deleteStudyGroup(id) {
    const studyGroup = await StudyGroup.findByPk(id);
    if (!studyGroup) {
        throw new Error("Grupul nu a fost găsit.");
    }
    await studyGroup.destroy();
}

//filtrare si paginare
async function getStudyGroupWithFilterAndPagination(filter){
  
    if (!filter.take)
      filter.take = 10; 

    if (!filter.skip)
      filter.skip = 1; 

    let whereClause = {};
    
    if (filter.studyGroupName){
        whereClause.StudyGroupName = {[LikeOp]: `%${filter.studyGroupName}%`};
    }
  
  
    return await StudyGroup.findAndCountAll (
      {   
        distinct: true,         
        where: whereClause,
        limit: parseInt(filter.take),
        offset: parseInt(filter.skip - 1) * parseInt(filter.take)
      });
}

//study groups of user
async function getStudyGroupsWhichUserIsPartOf(userId){
    const user=await User.findByPk(userId)
    const studyGroups = await user.getStudyGroups()
    return Array.isArray(studyGroups) ? studyGroups : [studyGroups] //vreau sa il intorc mereu ca array
}

//get members of a study group
async function getMembersOfStudyGroup(studyGroupId){
    const studyGroup=await getStudyGroupById(studyGroupId)
    const members=await studyGroup.getUsers();
    return members
}

export {
    getStudyGroups, getStudyGroupById, createStudyGroup, updateStudyGroup, deleteStudyGroup, getStudyGroupWithFilterAndPagination, getStudyGroupsWhichUserIsPartOf, getMembersOfStudyGroup
}