import express from 'express';
import cors from 'cors';
import env from "dotenv";
import DB_Init from "./entities/DB_init.js"
import createDbRouter from './routes/createDbRoute.js';
import userRouter from './routes/UserRouter.js';
import subjectRouter from './routes/SubjectRouter.js';
import userSubjectRouter from './routes/UserSubjectRouter.js';
import noteRouter from './routes/NoteRouter.js';
import tagRouter from './routes/TagRouter.js';


env.config()

let app = express();

app.use(express.json()); 
app.use(express.urlencoded({ 
    extended: true
}))

DB_Init();


app.use(cors());
app.use("/api", createDbRouter);
app.use("/api", userRouter);
app.use("/api", subjectRouter);
app.use("/api", userSubjectRouter);
app.use("/api", noteRouter);
app.use("/api", tagRouter);

let port = process.env.PORT || 8001;
app.listen(port);
console.log("API is running at " + port);