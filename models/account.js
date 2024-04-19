import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * @author Jack Weinstein
 */
const accountSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		select: false
	}
}, { timestamps: true });

// Hash password before saving user
accountSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

/**
 * Create and export the User model using ES module syntax
 * @author Jack Weinstein
 */
const Account = mongoose.model('Account', accountSchema, 'Accounts');

export default Account;