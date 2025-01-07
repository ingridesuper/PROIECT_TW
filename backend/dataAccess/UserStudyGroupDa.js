import UserStudyGroup from "../entities/UserStudyGroup.js";
import User from "../entities/User.js";
import StudyGroup from "../entities/StudyGroup.js"; 

async function getUserStudyGroups() {
    return await UserStudyGroup.findAll();
}

async function getUserStudyGroup(id) {
    return await UserStudyGroup.findByPk(id);
}

async function addUserToStudyGroup(userId, studyGroupId) {
    // verificam daca utilizatorul exista
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("Utilizatorul nu există.");
    }

    // verificam daca sg exista
    const studyGroup = await StudyGroup.findByPk(studyGroupId); 
    if (!studyGroup) {
        throw new Error("Grupul nu există.");
    }

    // verificam daca nu e deja parte din grup
    const isPart = await UserStudyGroup.findOne({
        where: { UserId: userId, StudyGroupId: studyGroupId }
    });
    if (isPart) {
        throw new Error("Utilizatorul face deja parte din acest grup.");
    }

    return await UserStudyGroup.create({ UserId: userId, StudyGroupId: studyGroupId });
}


// scoate din grup
async function removeUserFromStudyGroup(userStudyGroupId) {
    const userStudyGroup = await UserStudyGroup.findByPk(userStudyGroupId); 
    if (!userStudyGroup) {
        throw new Error("Acest user nu e parte din acest grup.");
    }
    await userStudyGroup.destroy();
}

async function getUserStudyGroupWithFilterAndPagination(filter){
  
    if (!filter.take)
      filter.take = 10; 

    if (!filter.skip)
      filter.skip = 1; 

    let whereClause = {};
    
    if (filter.userId){
        whereClause.UserId = filter.userId;
    }

    if(filter.studyGroupId){
        whereClause.StudyGroupId = filter.studyGroupId;
    }
  
  
    return await UserStudyGroup.findAndCountAll (
      {   
        distinct: true,         
        where: whereClause,
        limit: parseInt(filter.take),
        offset: parseInt(filter.skip - 1) * parseInt(filter.take)
      });
}

export { getUserStudyGroup, getUserStudyGroups, addUserToStudyGroup, removeUserFromStudyGroup, getUserStudyGroupWithFilterAndPagination};
