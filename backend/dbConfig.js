import Sequelize from 'sequelize';
import env from 'dotenv';

env.config();

const db = new Sequelize({
    dialect: 'mysql',
    database: 'NotesAppDatabase',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,  
    logging: false,
    define: {
    timestamps: false,
    freezeTableName: true
    }  
})

export default db;