import mongoose from 'mongoose';
import Logger, { EVENTS } from './actionlog.js';
import Event from './event.js';
const { Schema, model } = mongoose;

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
        ref: 'Account',
        select: 'username',
        required: true
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
         * Invites the guests(s) to the event if the user inviting is an admin or has {@link PERMISSIONS.INVITE_TO_ALL_EVENTS}
         * @example 
         *          const successfullyAddedUsers = await user.inviteGuests(christmasParty, "Bob Schmob", "Jacob BocaJ");
         *          if (!successfullyAddedUsers) {
         *              // Uh oh. No users were added.
         *              // Either there were no new users to add, the user doesn't have permissions, or adding this many users would go above the allowed invite/guest limits
         *          }
         * @param {mongoose.Model} event The event to invite guests to
         * @param  {...String | mongoose.Model} guests The guest(s) to invite
         * @returns {Promise<Boolean> | Promise<Array<String>>} An array of all guests that were successfully added. Empty is nothing is added.
         * @author Alexander Beck
         * @todo Possibly make an alias method in {@link Event}
         */
        async inviteGuests(event, ...guests) {
            if (!guests) return [];
            if (!event) return false;

            // Check if added users is within guest limit
            // Assumes true if there is no guest limit
            const guestLimitCheck = event?.guestLimit ?
                (event.attendees?.length ?? 0) + guests.length < event.guestLimit : true;

            // Check to see if added users is within inviter limit
            // Assumes true if there is no inviter limit (or guest limit)
            const inviterLimitCheck = event.guestLimit && event.guestLimit?.inviterLimit ?
                ((await event.getInviteIdsByUser(this))?.length ?? 0) + guests.length < event.guestLimit.inviterLimit : true;

            // If user is admin or user has PERMISSIONS.INVITE_TO_ALL_EVENTS
            // TODO: Implement this to work with event-by-event basis
            const permFlag = this.permissions.includes(PERMISSIONS.INVITE_TO_ALL_EVENTS) && guestLimitCheck && inviterLimitCheck;

            if (this.accountType === ACCOUNT_TYPE.ADMIN || permFlag) {
                // Check guest list to ensure that person is not already on it
                let successfullyAdded = [];
                // Has to be arrow notation; redefines 'this' otherwise
                guests.forEach(async (guest) => {

                    if (!event.attendees.some(attendee => attendee.guest === guest)) {
                        successfullyAdded.push(guest);
                        // Add user to the guest list
                        event.attendees.addToSet({ guest: guest, inviter: this });
                    }
                });

                try {
                    await event.save();
                    successfullyAdded.forEach(async (guest) => {
                        await Logger.create({
                            event: event,
                            subject: this,
                            guest: guest,
                            action: EVENTS.INVITE_GUEST
                        });
                    });
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
         * @param {mongoose.Model} event The event to uninvite guests from
         * @param  {...String} guests The guests to uninvite
         * @returns {Promise<Boolean> | Promise<Array<String>>} A list of all the guests successfuly removed, an empty list if no users were removed, and false if the user does not have the permissions to uninvite any of the guests
         * @author Alexander Beck
         */
        async uninviteGuests(event, ...guests) {
            if (!event) return false;
            if (!guests) return false;

            let successfullyRemoved = [];

            // Use hadPermissionAtLeastOnce to reduce redundant saves if the user was never allowed
            // to change anything in the first place. Ensures that false is returned if the user never
            // had the permissions, and [] is returned if the user had the permissions but nothing was changed
            let hadPermissionAtLeastOnce = false;

            guests.forEach(async (guest) => {
                // Can be evaluated to undefined > 0 which is false
                const isInviter = event?.attendees?.filter(attendee => attendee.guest === guest && attendee.inviter === this)?.length > 0;
                const isAllowedToInvite = this?.permissions.includes(PERMISSIONS.UNINVITE_TO_ALL_EVENTS) ?? false;
                if (this.accountType === ACCOUNT_TYPE.ADMIN || isAllowedToInvite || isInviter) {
                    hadPermissionAtLeastOnce = true;

                    if (event.attendees.some(attendee => attendee.guest === guest)) {
                        successfullyRemoved.push(guest);

                        // Remove guest from guest list
                        event.attendees = event.attendees.filter(attendee => attendee.guest !== guest);
                    }
                }
            });

            if (hadPermissionAtLeastOnce) {
                try {
                    await event.save();
                    successfullyRemoved.forEach(async (guest) => {
                        await Logger.create({
                            event: event,
                            subject: this,
                            guest: guest,
                            action: EVENTS.UNINVITE_GUEST
                        });
                    });
                    return successfullyRemoved;
                } catch (err) {
                    console.log(err);
                    return false;
                }
            } else {
                return false;
            }
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
                    await Logger.create({
                        subject: this,
                        target: user,
                        action: EVENTS.MAKE_ADMIN
                    });
                    return true;
                } catch (err) {
                    console.log(err);
                    return false;
                }
            }
            return false;
        },
    },
    statics: {
        /**
         * @requires account, userData
         * @param {mongoose.model} account The account of the new user
         * @param {*} userData An object containing all of the information for a User (Do not include username)
         * @returns {Promise<Boolean> | Promise<mongoose.Types.model>} The new user, or false if it fails to create one
         * @author Alexander Beck
         */
        async createUser(account, userData) {
            if (!account || !userData) return false;
            let newUser;
            try {
                newUser = await User.create({
                    username: account.username,
                    ...userData
                });

                await Logger.create({
                    subject: account,
                    target: newUser,
                    action: EVENTS.CREATE_ACCOUNT
                });
            } catch (err) {
                console.log(err);
                return false;
            }
            // Note, can return null as it is currently
            return newUser;
        },
    },
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
 * 
 *          // Inserting data
 *          const user = await User.create({
 *              firstName: 'Jane',
 *              lastName: 'Doe',
 *              gender: 'Female',
 *          });
 * 
 *          // Creating user with an account
 *          const JanesAccount = await Account.create({ 
 *              username: 'jdoe',
 *              password: 'JANES PASSWORD',
 *          });
 *          const Jane = await User.createUser(JanesAccount, {
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