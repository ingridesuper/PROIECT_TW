import db from "../dbConfig.js";
import {Sequelize} from "sequelize";

const User=db.define("User", {
    UserId: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },

    UserEmail: {
        type:Sequelize.STRING,
        allowNull:false,
        unique: true //unic
    }
})

export default User