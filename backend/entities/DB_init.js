import mysql from "mysql2/promise";
import env from "dotenv";
import User from "./User.js";
import Subject from "./Subject.js";
import UserSubject from "./UserSubject.js";
import Note from "./Note.js";
import Tag from "./Tag.js";

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

    UserSubject.hasMany(Note, {as:"UserNotes", foreignKey:"UserId"})
    UserSubject.hasMany(Note, {as:"SubjectNotes", foreignKey:"SubjectId"})
    Note.belongsTo(User, {foreignKey: "UserId"})
    Note.belongsTo(Subject, {foreignKey: "SubjectId"})

    Tag.hasMany(Note, {as:"NotesWithTag", foreignKey:"TagId"})
    Note.belongsTo(Tag, {foreignKey:"TagId"})
}

function DB_Init(){
    Create_DB();
    FK_Config();
}

export default DB_Init;