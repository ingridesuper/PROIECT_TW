import db from "../dbConfig.js";
import {DataTypes, Sequelize} from "sequelize";

const StudyGroup=db.define("StudyGroup", {
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },

    StudyGroupName: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

export default StudyGroup