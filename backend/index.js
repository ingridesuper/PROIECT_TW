import express from 'express';
import cors from 'cors';
import env from "dotenv";
import DB_Init from "./entities/DB_init.js"
import createDbRouter from './routes/createDbRoute.js';
import userRouter from './routes/UserRouter.js';
import subjectRouter from './routes/SubjectRouter.js';

env.config()

let app = express();
let router = express.Router();

app.use(express.json()); 
app.use(express.urlencoded({ 
    extended: true
}))

DB_Init();

app.use(cors());
app.use("/api", createDbRouter);
app.use("/api", userRouter);
app.use("/api", subjectRouter);

let port = process.env.PORT || 8001;
app.listen(port);
console.log("API is running at " + port);