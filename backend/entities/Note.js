import db from "../dbConfig.js";
import {DataTypes, Sequelize} from "sequelize";

const Note=db.define("Note", {
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },

    UserId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    SubjectId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    Title: {
        type: Sequelize.STRING,
        allowNull: false
    },

    Content: {
        type: Sequelize.TEXT, //TEXT - pt strings mai mari
        allowNull: true
    },

    CreatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },

    UpdatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW 
    },

    TagId: {
        type:DataTypes.INTEGER,
        allowNull:true,
    }
})

export default Note