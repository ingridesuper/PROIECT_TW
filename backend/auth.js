import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/google/callback`,
    passReqToCallback: true
},
function(request, accessToken, refreshToken, profile, done) {
    console.log("Profilul utilizatorului:", profile);
    return done(null, profile);
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
