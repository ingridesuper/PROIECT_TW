import db from "../dbConfig.js";
import {Sequelize} from "sequelize";

const Subject=db.define("Subject", {
    SubjectId: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },

    SubjectName: {
        type:Sequelize.STRING,
        allowNull:false
    },

    SubjectDescription:{
        type:Sequelize.STRING,
        allowNull:true
    }
})

export default Subject