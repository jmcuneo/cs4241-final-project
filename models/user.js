import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Note: Not even closed to finished.
// Hasn't be debugged, tested, or anything of the like. 

/**
 * @author Alexander Beck
 * @example 
 *      ACCOUNT_TYPE.genpop = 'genpop'
 *      ACCOUNT_TYPE.admin = 'admin'
 *      ACCOUNT_TYPE.other = 'other'
 */
export const ACCOUNT_TYPE = Object.freeze({
    GENPOP: 'GENPOP',
    ADMIN: 'ADMIN',
    OTHER: 'OTHER'
});

/**
 * @author Alexander Beck
 * 
 * May or may not end up using these. Just an idea.
 */
export const PERMISSIONS = Object.freeze({
    EDIT_ALL_EVENTS: 'EDIT_ALL_EVENTS',
    EDIT_ALL_USERS: 'EDIT_ALL_USERS',
    REMOVE_ALL_USERS: 'REMOVE_ALL_USERS',
    INVITE_TO_ALL_EVENTS: 'INVITE_TO_ALL_EVENTS',
    GIFT_ADMIN: 'GIFT_ADMIN',
    CREATE_EVENT: 'CREATE_EVENT',
});

/**
 * Defaults: accountType = {@linkcode ACCOUNT_TYPE.genpop}
 * 
 * Not required: username, gender
 * @author Alexander Beck
 * @JackWeinstein808 Username uniqueness checking (consider using the User.exists() method)
 * @todo implement permissions
 */
const userSchema = new Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
        required: true
    },
    firstName: {
        type: String,
        minLength: 1,
        required: true,
    },
    lastName: {
        type: String,
        minLength: 1,
        required: true,
    },
    username: {
        type: String,
        minLength: 1,
        required: false,
    },
    gender: {
        type: String,
        required: false,
    },
    accountType: {
        type: String,
        default: ACCOUNT_TYPE.GENPOP,
        enum: {
            values: Object.values(ACCOUNT_TYPE),
            message: 'VALUE is not a supported account type.'
        },
        required: true,
    },
    // TODO: Implement permissions (make them actually matter)
    permissions: [{
        // permission: {
            type: String,
            enum: {
                values: Object.values(PERMISSIONS),
                message: 'VALUE is not a supported permission'
            },
            required: false,
        // }
    }],
}, { timestamps: true, toObject: {virtuals: true} });

/**
 * Creates a fullName field that is not actually stored in the DB, but can still be accessed.
 * Note: Because they are not stored in the DB, you cannot query with them.
 */
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

/**
 * @author Alexander Beck
 * @requires firstName, lastName
 * @example
 *          // Inserting data
 *          const user = await User.create({
 *              firstName: 'Jane',
 *              lastName: 'Doe',
 *              gender: 'Female',
 *          });
 * 
 *          // Updating data
 *          user.firstName = 'John';
 *          user.lastName = 'Smith';
 *          user.accountType = ACCOUNT_TYPE.ADMIN;
 *          await user.save();
 * 
 *          // Finding data
 *          const user = await User.findById("{id}").exec();
 * 
 *          // Getting only specific data
 *          const user = await User.findById("{id}", "firstName lastName").exec();
 * 
 *          // Deleting data
 *          // If the query to delete data is from a user, remember to check if they have the permissions!
 *          const user = await User.deleteOne({firstName: "Jane"});
 *          const user = await User.deleteMany({firstName: "Jane"});
 * @see {@link userSchema}
 */
const User = model('User', userSchema, 'Users');

export default User;