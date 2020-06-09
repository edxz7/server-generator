import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;
import bcrypt from 'bcrypt';
import { User } from '../entities/User.entity';
import { getRepository } from 'typeorm';

const verifyCallback = async (email, password, done) => {
  try {
    const user = await getRepository(User).findOne({ email: email });
    if(!user) {
      return done(null, false, { message: 'Not user found'})
    }
    if(!user.password) {
      return done(null, false, { message: 'You signup using one of your social accounts, register your email or login using a social account'})
    }
    const isValid = bcrypt.compareSync(password, user.password);

    if(isValid) return done(null, user) 
    else        return done(null, false, { message: "Incorrect password"})

  } catch (err) {
    done("There was an error with the server", false, { message: 'Server internal error'})
    console.log(err)
  }
}

const strategy = new LocalStrategy({
  usernameField: 'email',  
  passwordField: 'password'
}, verifyCallback);

passport.use(strategy);

passport.serializeUser((user: User, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  getRepository(User).findOne( id )
  .then(user => cb(null, user)) 
  .catch(error => cb(error, null));
});

export default passport;