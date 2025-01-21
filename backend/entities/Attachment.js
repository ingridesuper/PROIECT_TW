import db from "../dbConfig.js";
import {DataTypes, Sequelize} from "sequelize";

const Attachment = db.define("Attachment", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
  
    NoteId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  
    FilePath: {
      type: Sequelize.STRING,
      allowNull: false
    },
  
    FileName: {
      type: Sequelize.STRING,
      allowNull: false
    },

    FileType: {
      type: Sequelize.STRING, 
      allowNull: false
    }
  });
  
  
export default Attachment  