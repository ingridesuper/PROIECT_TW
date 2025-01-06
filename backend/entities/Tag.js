import db from "../dbConfig.js";
import {Sequelize} from "sequelize";

const Tag=db.define("Tag", {
    TagId: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },

    TagName: {
        type:Sequelize.STRING,
        allowNull:false,
        unique: true 
    }
})

export default Tag