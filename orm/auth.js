import passport from "passport";    
import LocalStrategy from 'passport-local';
import {userCreate, getUser} from './controllers/users.js';
import passportJWT  from 'passport-jwt';





passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, done) => {
    
    try{
        const user = await userCreate({
            fullName: req.body.fullName,
            username: username,
            password: password,
        });
        done(null, user);

    } catch(err){
        done(err);
    }
}));

passport.use('login', new LocalStrategy( async (username, password, done) => {

    try {
        const user = await getUser({username});
        if (!user) {
            return done(new Error("username or password invalid"));
        }

        if (!await user.isValidPassword(password)){
            done(new Error("username or password invalid"));
        }


        done(null, user)

    } catch(err) {
        done(err);
    }
}));


passport.use(new passportJWT.Strategy(
    {
    secretOrKey:'jwt',
    'jwtFromRequest': passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()


}, (tokenPayload, done) => {
    try {
        console.log(tokenPayload);
        done(null, tokenPayload);
    } catch(err) {
        done(err);
    }



}));