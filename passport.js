import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import Account from './models/account.js';
import bcrypt from 'bcrypt';


/**
 * Define your LocalStrategy
 * @author Jack Weinstein
 */
const localStrategy = new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, async (username, password, done) => {
	try {
		const account = await Account.findOne({ username });
		if (!account) {
			return done(null, false);
		}

		const isMatch = await bcrypt.compare(password, account.password);
		if (isMatch) {
			return done(null, account);
		} else {
			return done(null, false);
		}
	} catch (error) {
		return done(error);
	}
});

// Serialize user
passport.serializeUser((account, done) => {
	done(null, { id: account.id, username: account.username });
});

// Deserialize user
passport.deserializeUser((id, done) => {
	Account.findById(id, (err, account) => {
		done(err, account);
	});
});

// Use the local strategy
passport.use(localStrategy);

/**
 * Export passport as the default export
 * @author Jack Weinstein
 */
export default passport;
