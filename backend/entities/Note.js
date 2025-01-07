import db from "../dbConfig.js";
import {DataTypes, Sequelize} from "sequelize";

const Note=db.define("Note", {
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },

    UserSubjectId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    Title:{
        type: Sequelize.STRING,
        allowNull: false
    },

    Content: {
        type: Sequelize.TEXT, //TEXT - pt strings mai mari
        allowNull: true
    },

    //aici tb sa se poate schimba doarupdatedAt dupa creare -> vezi cum

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