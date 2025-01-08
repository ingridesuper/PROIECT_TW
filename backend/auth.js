import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import {getUserByEmail, createUser} from "./dataAccess/UserDa.js"

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/google/callback`,
    passReqToCallback: true
},
async function (request, accessToken, refreshToken, profile, done) {
  try {
      console.log("Profilul utilizatorului:", profile);

      const email = profile.email;

      if (!email.endsWith("@stud.ase.ro")) {
          console.log("Email-ul trebuie să fie un cont instituțional.");
          return done(null, false, { message: "Email-ul trebuie să fie un cont instituțional (@stud.ase.ro)" });
      }

      let user = await getUserByEmail(email);

      if (user) {
          // utilizatorul exista
          console.log(`Utilizator gasit: ${email}`);
          return done(null, user);
      } else {
          // utilizatorul nu exista; il vom adauga
          try {
              user = await createUser({ UserEmail: email });
              console.log(`Utilizator creat: ${email}`);
              return done(null, user);
          } catch (error) {
              console.error("Eroare la crearea utilizatorului:", error);
              return done(error, false);
          }
      }
  } catch (error) {
      console.error("Eroare în procesul de autentificare:", error);
      return done(error, false);
  }
}));

// apelata dupa ce un utilizator este autentificat cu succes
//pt a stoca info esentiale in sesiune
passport.serializeUser(function(user, done) {
  done(null, user);
});

// apelata de fiecare data cand o cerere este facuta de un utilizator autentificat
//pt a lua datele din sesiune
passport.deserializeUser(function(user, done) {
  done(null, user);
});
