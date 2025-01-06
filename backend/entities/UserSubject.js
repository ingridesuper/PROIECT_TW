import db from "../dbConfig.js";
import {Sequelize} from "sequelize";

const UserSubject=db.define("UserSubject", {
    SubjectId: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:false,
        allowNull:false
    },

    UserId: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:false,
        allowNull:false
    }
})

export default UserSubject