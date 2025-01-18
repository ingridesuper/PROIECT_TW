import mysql from "mysql2/promise";
import env from "dotenv";
import User from "./User.js";
import Subject from "./Subject.js";
import UserSubject from "./UserSubject.js";
import Note from "./Note.js";
import Tag from "./Tag.js";
import db from "../dbConfig.js";
import StudyGroup from "./StudyGroup.js";
import UserStudyGroup from "./UserStudyGroup.js";


env.config();

function Create_DB(){
    let conn;

    mysql.createConnection({
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD
    })
    .then((connection) => {
    conn = connection
    return connection.query('CREATE DATABASE IF NOT EXISTS NotesAppDatabase')
    
    })
    .then(() => {
    return conn.end()
    })
    .catch((err) => {
    console.warn(err.stack)
    })
    
}

function FK_Config(){
    User.belongsToMany(Subject, {through: "UserSubject", as: "Subjects", foreignKey: "UserId"});
    Subject.belongsToMany(User, {through: "UserSubject", as: "Users", foreignKey: "SubjectId"});

    UserSubject.hasMany(Note, {as:"UserSubjectNotes", foreignKey:"UserSubjectId"})
    Note.belongsTo(UserSubject, {foreignKey: "UserSubjectId"})

    Tag.hasMany(Note, {as:"NotesWithTag", foreignKey:"TagId"})
    Note.belongsTo(Tag, {foreignKey:"TagId"})

    User.belongsToMany(StudyGroup, {through: "UserStudyGroup", as:"StudyGroups", foreignKey: "UserId"});
    StudyGroup.belongsToMany(User, {through: "UserStudyGroup", as:"Users", foreignKey: "StudyGroupId"});
}

//pt adaugare tabele noi
// async function DB_Init() {
//     Create_DB();
//     FK_Config();
    
//     try {
//         await db.sync({ force: true });  // This will drop and recreate tables every time the app starts
//         console.log("Database tables created successfully.");
//     } catch (error) {
//         console.warn("Error while syncing the database:", error.stack);
//     }
// }


function DB_Init() {
    Create_DB();
    FK_Config();
}

export default DB_Init;