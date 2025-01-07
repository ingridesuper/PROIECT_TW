import db from "../dbConfig.js";
import { Sequelize } from "sequelize";

const UserStudyGroup = db.define("UserStudyGroup", {
    UserStudyGroupId: {
    type: Sequelize.INTEGER,
    primaryKey: true,      
    autoIncrement: true, 
    allowNull: false       
  },

  StudyGroupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  UserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
}, {
  indexes: [
    {
      unique: true, 
      fields: ['UserId', 'StudyGroupId']
    }
  ]
});

export default UserStudyGroup;