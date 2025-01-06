import express from 'express';
import cors from 'cors';
import env from "dotenv";
import DB_Init from "./entities/DB_init.js"

env.config()

let app = express();
let router = express.Router();

app.use(express.json()); 
app.use(express.urlencoded({ 
    extended: true
}))

DB_Init()

app.use(express.static('public'));
app.use(cors());
app.use("/api", router);

let port = process.env.PORT || 8001;
app.listen(port);
console.log("API is running at " + port);