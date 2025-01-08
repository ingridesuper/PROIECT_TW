import express from 'express';
import env from "dotenv";
import DB_Init from "./entities/DB_init.js"
import createDbRouter from './routes/createDbRoute.js';
import userRouter from './routes/UserRouter.js';
import subjectRouter from './routes/SubjectRouter.js';
import userSubjectRouter from './routes/UserSubjectRouter.js';
import noteRouter from './routes/NoteRouter.js';
import tagRouter from './routes/TagRouter.js';
import studyGroupRouter from './routes/StudyGroupRouter.js';
import userStudyGroupRouter from './routes/UserStudyGroupRouter.js';

import passport from 'passport';
import session from 'express-session';
import './auth.js'

env.config()

let app = express();

app.use(express.json()); 
app.use(express.urlencoded({ 
    extended: true
}))

DB_Init();

//configurare sesiune si pasaport
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res)=>{
    res.send('<a href="/auth/google">Autentificare prin Google</a>')
})

//ruta autentificare
app.get('/auth/google', passport.authenticate('google', {
    scope: ['email']
}));

//callback autentificare
app.get('/google/callback', 
    passport.authenticate('google', {
        successRedirect: '/protected',  // redirectioneaza utilizatorul dupa autentificare
        failureRedirect: '/auth/failure' // redirectioneaza in caz de esec
    })
);

app.get('/protected', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Bun venit! Ești autentificat.');
    } else {
        res.redirect('/auth/google');
    }
});

// Pagina de eroare
app.get('/auth/failure', (req, res) => {
    res.send('Autentificarea a eșuat.');
});

// Middleware pentru protejarea rutei
function isLoggedIn(req, res, next){
    req.user? next() : res.sendStatus(401)
}

app.use("/api", isLoggedIn, createDbRouter);
app.use("/api", isLoggedIn, userRouter);
app.use("/api", isLoggedIn, subjectRouter);
app.use("/api", isLoggedIn, userSubjectRouter);
app.use("/api", isLoggedIn, noteRouter);
app.use("/api", isLoggedIn, tagRouter);
app.use("/api", isLoggedIn, studyGroupRouter);
app.use("/api", isLoggedIn, userStudyGroupRouter);

let port = process.env.PORT || 8001;
app.listen(port);
console.log("API is running at " + port);