import mongoose from 'mongoose';
import Logger, { EVENTS } from './actionlog.js';
import Event from './event.js';
const { Schema, model } = mongoose;

// Note: Not even closed to finished.
// Hasn't be debugged, tested, or anything of the like. 

/**
 * @author Alexander Beck
 * @example 
 *      ACCOUNT_TYPE.GENPOP = 'GENPOP'
 *      ACCOUNT_TYPE.ADMIN = 'ADMIN'
 */
export const ACCOUNT_TYPE = Object.freeze({
    GENPOP: 'GENPOP',
    ADMIN: 'ADMIN',
});

/**
 * @author Alexander Beck
 * 
 * May or may not end up using these. Just an idea.
 */
export const PERMISSIONS = Object.freeze({
    MODIFY_EVENTS: 'MODIFY_EVENTS',
    MODIFY_USERS: 'MODIFY_USERS',
    REMOVE_ALL_USERS: 'REMOVE_ALL_USERS',
    INVITE_TO_ALL_EVENTS: 'INVITE_TO_ALL_EVENTS',
    UNINVITE_TO_ALL_EVENTS: 'UNINVITE_TO_ALL_EVENTS',
    GIFT_ADMIN: 'GIFT_ADMIN',
    CREATE_EVENT: 'CREATE_EVENT',
});

/**
 * Defaults: accountType = {@linkcode ACCOUNT_TYPE.genpop}
 * 
 * Not required: gender, accountType, permissions
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
        type: String,
        enum: {
            values: Object.values(PERMISSIONS),
            message: 'VALUE is not a supported permission'
        },
        required: false,
    }],
}, {
    timestamps: true, toObject: { virtuals: true },
    methods: {
        /**
         * Adds permissions to another user if the current user is an {@link ACCOUNT_TYPE.ADMIN} or the user has {@link PERMISSIONS.MODIFY_USERS}
         * @param {mongoose.ObjectId | mongoose.Model} other The user (or user id) to add the permissions to
         * @param  {...String} permissions The permissions to add. Ignores those not in {@link PERMISSIONS}
         * @returns {Promise<Boolean>} True if all the permissions were successfully added, false otherwise
         * @author Alexander Beck
         */
        async addPermissionsToOtherUser(other, ...permissions) {
            if (!other) return false;
            if (!permissions) return false;

            // If user is admin or user has PERMISSIONS.MODIFY_USERS
            if (this.accountType === ACCOUNT_TYPE.ADMIN || this.permissions.includes(PERMISSIONS.MODIFY_USERS)) {
                const changesWereMade = await addPermissionsToUser(other, false, ...permissions);
                if (changesWereMade) {
                    // Log the action to the logger
                    await Logger.create({
                        subject: this._id,
                        target: other,
                        action: EVENTS.MODIFY_PERMISSIONS
                    });
                }
                return changesWereMade; // boolean representing if the changes were made

            } else {
                // TODO: Do an error or something here, not allowed to change others permissions
                return false;
            }
        },

        /**
         * @author Alexander Beck
         * @param {*} eventDetails The schema details of an event.
         * @returns {Promise<mongoose.Model> | Promise<Boolean>} A newly created event, or false if it fails
         * @example const christmasPartySchema = {
         *              name: 'Christmas Party',
         *              date: new Date(2024, 11, 25),
         *              location: 'Unity 520',
         *              guestLimit: 4
         *          };
         *
         *          const christmasParty = await user.createEvent(christmasPartySchema);
         */
        async createEvent(eventDetails) {
            // If user is admin or user has PERMISSIONS.CREATE_EVENT
            // eventDetails is an added to check to ensure that it is not empty
            if (eventDetails && (this.accountType === ACCOUNT_TYPE.ADMIN || this.permissions.includes(PERMISSIONS.CREATE_EVENT))) {
                const event = await Event.create({
                    creator: this._id,
                    ...eventDetails
                });
                await Logger.create({
                    action: EVENTS.CREATE_EVENT,
                    event: event
                });
                return event;
            } else {
                // TODO: Do an error or something here, not allowed to create event
                return false;
            }
        },

        /**
         * Invites the user(s) to the event if the user inviting is an admin or has {@link PERMISSIONS.INVITE_TO_ALL_EVENTS}
         * @example 
         *          const successfullyAddedUsers = await user.inviteUsers(christmasParty, user2, user3, user4);
         *          if (!successfullyAddedUsers) {
         *              // Uh oh. No users were added.
         *              // Either there were no new users to add, the user doesn't have permissions, or adding this many users would go above the allowed invite/guest limits
         *          }
         * @param {mongoose.Model} event The event to invite users to
         * @param  {...mongoose.Model | mongoose.Types.ObjectId} users The user(s) to invite
         * @returns {Promise<Boolean> | Promise<Array<mongoose.Model>>} An array of all users that were successfully added. Empty is nothing is added.
         * @author Alexander Beck
         * @todo Possibly make an alias method in {@link Event}
         */
        async inviteUsers(event, ...users) {
            if (!users) return [];
            if (!event) return false;

            // Check if added users is within guest limit
            // Assumes true if there is no guest limit
            // TODO: Make this event?.guestLimit maybe
            const guestLimitCheck = event?.guestLimit ?
                (event.attendees?.length ?? 0) + users.length < event.guestLimit : true;

            // Check to see if added users is within inviter limit
            // Assumes true if there is no inviter limit (or guest limit)
            const inviterLimitCheck = event.guestLimit && event.guestLimit?.inviterLimit ?
                ((await Event.getInvitesByUser(event, this))?.length ?? 0) + users.length < event.guestLimit.inviterLimit : true;

            // If user is admin or user has PERMISSIONS.INVITE_TO_ALL_EVENTS
            // TODO: Implement this to work with event-by-event basis
            const permFlag = this.permissions.includes(PERMISSIONS.INVITE_TO_ALL_EVENTS) && guestLimitCheck && inviterLimitCheck;

            if (this.accountType === ACCOUNT_TYPE.ADMIN || permFlag) {
                // Check guest list to ensure that person is not already on it
                let successfullyAdded = [];
                // Has to be arrow notation; redefines 'this' otherwise
                users.forEach(async (user) => {
                    // Ensure that user is an object and not just an id
                    // TODO: Test if this works for both ids and users.
                    if (user instanceof mongoose.Types.ObjectId) {
                        user = await User.findById(user);
                    }

                    if (!event.attendees.some(attendee => attendee.guest === user._id)) {
                        successfullyAdded.push(user);
                        // Add user to the guest list
                        event.attendees.addToSet({ guest: user, inviter: this });
                    }
                });

                try {
                    await event.save();
                    return successfullyAdded;
                } catch (err) {
                    console.log(err);
                    return false;
                }
            } else {
                // TODO: Do an error or something here, not allowed to invite people
                return false;
            }
        },

        /**
         * 
         * @param {mongoose.Model} event The event to uninvite users from
         * @param  {...mongoose.Model | mongoose.Types.ObjectId} users The users to uninvite
         * @returns {Promise<Boolean>} A boolean representing if all the users were successfuly removed
         * @author Alexander Beck
         */
        async uninviteUsers(event, ...users) {
            if (!event) return false;
            if (!users) return false;
            // Perms to univite all or admin
            // or 'this' invited the user
            return "NOT IMPLEMENTED YET";
        },

        /**
         * Note: Unlike other functions, makeAdmin does not work if a user is admin by default. The user **must**
         * have {@link PERMISSIONS.GIFT_ADMIN}.
         * @example if (await user.makeAdmin(user2)) {};
         * @param {mongoose.Model} user The user to make admin
         * @returns {Promise<Boolean>} True if the user was sucessfully made admin, false otherwise
         * @author Alexander Beck
         */
        async makeAdmin(user) {
            if (!user) return false;
            // Defaults to false if the permissions are not initialized
            if (this?.permissions?.includes(PERMISSIONS.GIFT_ADMIN) ?? false) {
                try {
                    user.accountType = ACCOUNT_TYPE.ADMIN;
                    await user.save();
                    return true;
                } catch (err) {
                    console.log(err);
                    return false;
                }
            }
            return false;
        },
    }
});

/**
 * Creates a fullName field that is not actually stored in the DB, but can still be accessed.
 * Note: Because they are not stored in the DB, you cannot query with them.
 */
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

/**
 * @author Alexander Beck
 * @requires firstName, lastName, username
 * @example
 *          // DO NOT FOLLOW THESE UNTIL I REMOVE THIS MESSAGE,
 *          // IT MEANS I HAVE FORGOTTEN TO IMPLEMENT NEW EXAMPLES
 * 
 *          // Inserting data
 *          const user = await User.create({
 *              firstName: 'Jane',
 *              lastName: 'Doe',
 *              username: 'jdoe',
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

/**
 * @author Alexander Beck
 * @param {mongoose.ObjectId | mongoose.Model} userId The user to add the permissions to
 * @param {Boolean} isServer A boolean representing if the function should log that the server ran this.
 * Note, if false, **no subject will be added to the Logger**. Use false if there is a known subject user.
 * @param  {...String} permissions The permissions to add. Ignores those not in {@link PERMISSIONS}
 * @returns {Promise<Boolean>} Returns true if the permissions were successfully added, false if not
 */
export async function addPermissionsToUser(userId, isServer, ...permissions) {
    if (permissions) {
        const user = userId instanceof mongoose.Model ? userId : await User.findById(userId);
        const validPermissions = [];
        permissions.forEach(permission => {
            // Ensure that the permission is in PERMISSIONS
            if (Object.values(PERMISSIONS).includes(permission)) {
                validPermissions.push(permission);
            }
        });
        try {
            user.permissions.addToSet(...validPermissions);
            await user.save().then(async function () {
                // TODO: Check if this .then(async) works properly (it likely will error)
                if (isServer) {
                    // Only create a log if the server ran it
                    await Logger.create({
                        action: EVENTS.MODIFY_PERMISSIONS,
                        target: user
                    });
                }
                return true;
            });
        } catch (err) {
            console.log(err);
        }
    }
    return false;
}