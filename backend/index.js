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
import cors from 'cors';
import './auth.js'

env.config()

let app = express();

app.use(express.json()); 
app.use(cors())
app.use(express.urlencoded({ 
    extended: true
}))


DB_Init();

//configurare sesiune si pasaport
app.use(session({
    secret: 'cats', // Replace with a secure secret
    resave: false, // Prevents session from being saved on every request
    saveUninitialized: false, // Saves only if a session is modified
    cookie: {
      secure: false, // Set true if using HTTPS
      maxAge: 1000 * 60*5, // 5 minute session expiration
    }
  }));

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
        successRedirect: 'http://localhost:3000',  // redirectioneaza utilizatorul dupa autentificare
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

// endpoint pentru a verifica statusul autentificării
app.get('/api/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ isAuthenticated: true, user: req.user });
    } else {
      res.json({ isAuthenticated: false });
    }
  });

  //destroys the session
  app.get('/api/auth/logout', (req, res) => {
    req.logout(err => {
      if (err) { return next(err); }
      req.session.destroy(); // Destroy session
    });
  });
  
  

app.use("/api", isLoggedIn, createDbRouter);
app.use("/api", isLoggedIn, userRouter);
app.use("/api", isLoggedIn, subjectRouter);
app.use("/api", isLoggedIn, userSubjectRouter);
app.use("/api", isLoggedIn, noteRouter);
app.use("/api", isLoggedIn, tagRouter);
app.use("/api", isLoggedIn, studyGroupRouter);
app.use("/api", isLoggedIn, userStudyGroupRouter);
// app.use("/api", createDbRouter);
// app.use("/api", userRouter);
// app.use("/api", subjectRouter);
// app.use("/api", userSubjectRouter);
// app.use("/api", noteRouter);
// app.use("/api", tagRouter);
// app.use("/api", studyGroupRouter);
// app.use("/api", userStudyGroupRouter);

let port = process.env.PORT || 8001;
app.listen(port);
console.log("API is running at " + port);