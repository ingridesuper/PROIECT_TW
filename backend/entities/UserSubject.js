import db from "../dbConfig.js";
import { Sequelize } from "sequelize";

const UserSubject = db.define("UserSubject", {
  UserSubjectId: {
    type: Sequelize.INTEGER,
    primaryKey: true,      
    autoIncrement: true, 
    allowNull: false       
  },

  SubjectId: {
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
      unique: true, // combinatia UserId, SubjectId - unică
      fields: ['UserId', 'SubjectId']
    }
  ]
});

export default UserSubject;