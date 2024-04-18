import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './account.model.js'; 

// Define your LocalStrategy
const localStrategy = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false);
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error);
  }
});

// Serialize user
passport.serializeUser((user, done) => {
  done(null, { id: user.id, username: user.username });
});

// Deserialize user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Use the local strategy
passport.use(localStrategy);

// Export passport as the default export
export default passport;
