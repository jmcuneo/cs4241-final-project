import mongoose from 'mongoose';
import Logger, { EVENTS } from './actionlog.js';
import Event from './event.js';
import { hideFieldsFromObject } from '../server.js';
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
    MODIFY_EVENTS: 'MODIFY_EVENTS', // Change event details
    MODIFY_USERS: 'MODIFY_USERS', // Add users to allowedInviters in all events
    REMOVE_ALL_USERS: 'REMOVE_ALL_USERS',
    INVITE_TO_ALL_EVENTS: 'INVITE_TO_ALL_EVENTS', // Invite guests to all events
    UNINVITE_TO_ALL_EVENTS: 'UNINVITE_TO_ALL_EVENTS', // Uninvite guests from all events
    GIFT_ADMIN: 'GIFT_ADMIN', // Make other users admin
    CREATE_EVENT: 'CREATE_EVENT', // Create events
    DELETE_EVENT: 'DELETE_EVENT'
});

/**
 * Defaults: accountType = {@linkcode ACCOUNT_TYPE.genpop}
 * 
 * Not required: accountType, permissions
 * @author Alexander Beck
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
    accountType: {
        type: String,
        default: ACCOUNT_TYPE.GENPOP,
        enum: {
            values: Object.values(ACCOUNT_TYPE),
            message: 'VALUE is not a supported account type.'
        },
        required: true,
    },
    permissions: [{
        type: String,
        enum: {
            values: Object.values(PERMISSIONS),
            message: 'VALUE is not a supported permission'
        },
        required: false,
    }],
}, {
    timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true },
    virtuals: {
        fullName: {
            type: String,
            get() {
                return `${this.firstName} ${this.lastName}`;
            }
        },
        prettyAccountType: {
            type: String,
            get() {
                return this.accountType === ACCOUNT_TYPE.ADMIN ? 'Admin' : 'General';
            }
        }
    },
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
            if (permissions.length === 0) return false;

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
         * @requires {@link PERMISSIONS.MODIFY_EVENTS}
         * @param {mongoose.Model} event The event to add allowed inviters to
         * @param  {...mongoose.Model | mongoose.Types.ObjectId} users The user(s) to add to the allowed inviters list
         * @returns {Promise<Boolean>} A boolean representing if the users were successfully given the permissions (NOT referring to {@link PERMISSIONS})
         * @author Alexander Beck
         */
        async makeAllowedToInvite(event, ...users) {
            if (event === undefined) return false;
            if (users === undefined) return false;
            if (users.length === 0) return false;

            if (this.accountType === ACCOUNT_TYPE.ADMIN || this.permissions.includes(PERMISSIONS.MODIFY_EVENTS) || event.creator === this._id) {
                let successfullyAdded = [];
                users.forEach(user => {
                    if (!event.allowedInviters.some(existingUser => existingUser === user)) {
                        successfullyAdded.push(user);
                        event.allowedInviters.addToSet(user);
                    }
                });

                try {
                    await event.save();
                    successfullyAdded.forEach(async (user) => {
                        await Logger.create({
                            event: event,
                            subject: this,
                            target: user,
                            action: EVENTS.ADD_USER_TO_ALLOWED_INVITERS
                        });
                    });
                    return true;
                } catch (err) {
                    console.log(err);
                    return false;
                }
            }
            return false;
        },

        /**
         * @requires {@link PERMISSIONS.MODIFY_EVENTS}
         * @param {mongoose.Model} event The event to remove allowed inviters from
         * @param  {...mongoose.Model | mongoose.Types.ObjectId} users The user(s) to remove from the allowed inviters list
         * @returns {Promise<Boolean>} A boolean representing if the users were successfully removes from the allowed listeners list
         * @author Alexander Beck
         */
        async makeUnableToInvite(event, ...users) {
            if (!event || !users) return false;
            if (users.length === 0) return false;

            if (this.accountType === ACCOUNT_TYPE.ADMIN || this.permissions.includes(PERMISSIONS.MODIFY_EVENTS) || event.creator === this._id) {
                let successfullyRemoved = [];
                users.forEach(user => {
                    if (event.allowedInviters.some(existingUser => existingUser === user)) {
                        successfullyRemoved.push(user);

                        event.allowedInviters = event.allowedInviters.filter(allowedInviter => allowedInviter !== user);
                    }
                });

                try {
                    await event.save();
                    successfullyRemoved.forEach(async (user) => {
                        await Logger.create({
                            event: event,
                            subject: this,
                            target: user,
                            action: EVENTS.REMOVE_USER_FROM_ALLOWED_INVITERS
                        });
                    });
                    return true;
                } catch (err) {
                    console.log(err);
                    return false;
                }
            }
            return false;
        },
        /**
         * @requires {@link PERMISSIONS.CREATE_EVENT}
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
                    event: event,
                    subject: this
                });
                return event;
            } else {
                // Not allowed to create an event
                return false;
            }
        },
        /**
         * @requires {@link PERMISSIONS.DELETE_EVENT}
         * @author Alexander Beck
         * @param {*} eventId The event Id
         * @returns {Promise<Boolean>} A boolean representing the success of deleting the event
         * @example await user.deleteEvent('Christmas Party');
         */
        async deleteEvent(eventId) {
            if (eventId === undefined) return false;
            const event = await Event.findOne({ _id: eventId });
            // If user is admin, has PERMISSIONS.DELETE_EVENT, or is the event's creator
            // eventDetails is an added to check to ensure that it is not empty
            if (eventId && (this.accountType === ACCOUNT_TYPE.ADMIN || this.permissions.includes(PERMISSIONS.DELETE_EVENT) || event.creator.equals(this._id))) {
                const unsavedLog = new Logger({
                    action: EVENTS.DELETE_EVENT,
                    event: event,
                    subject: this
                });

                await Event.deleteOne({ _id: eventId });

                await unsavedLog.save();
                return true;
            } else {
                // Not allowed to delete an event
                return false;
            }
        },

        /**
 * @requires id, {@link PERMISSIONS.MODIFY_EVENTS}
 * @author Alexander Beck
 * @param {mongoose.Model} event The event to modify
 * @param {*} eventDetails The schema details of an event.
 * @returns {Promise<mongoose.Model> | Promise<Boolean>} An edited event, or false if it fails
 */
        async modifyEvent(event, eventDetails) {
            if (!event) return false;
            // If user is admin or user has PERMISSIONS.MODIFY_EVENT
            // eventDetails is an added to check to ensure that it is not empty
            const isEventCreator = event.creator.equals(this._id);
            if (eventDetails !== undefined && (this.accountType === ACCOUNT_TYPE.ADMIN || this.permissions.includes(PERMISSIONS.MODIFY_EVENTS)) || isEventCreator) {
                const validProperties = ['name', 'location', 'date', 'guestLimit', 'inviterLimit'];
                const sanitizedProperties = [];

                // Only get the allowed properties from the input, ignore the rest
                Object.keys(eventDetails).forEach(property => {
                    if (validProperties.includes(property)) {
                        sanitizedProperties.push(property);
                    }
                });
                if (sanitizedProperties.length === 0) return false;
                try {
                    const user = this;
                    sanitizedProperties.forEach(async (key) => {
                        switch (key) {
                            /*case 'name':
                                try {
                                    event.name = eventDetails[key];
                                    await event.validate();
                                } catch (err) {
                                    console.error('Error renaming event');
                                    return false;
                                }
                                break;*/
                            case 'guestLimit':
                                await event.setGuestLimit(user, eventDetails[key]);
                                break;
                            case 'inviterLimit':
                                await event.setInviterLimit(user, eventDetails[key]);
                                break;
                            default:
                                event[key] = eventDetails[key];
                                break;
                        }
                    });

                    await event.save();

                    await Logger.create({
                        action: EVENTS.MODIFY_EVENT,
                        event: event,
                        subject: this
                    });
                    return event;
                } catch (error) {
                    console.error(error);
                    return false;
                }
            } else {
                // Not allowed to modify the event
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
         * @requires {@link PERMISSIONS.INVITE_TO_ALL_EVENTS}
         * @param {mongoose.Model} event The event to invite guests to
         * @param  {...String | mongoose.Model} guests The guest(s) to invite
         * @returns {Promise<Boolean> | Promise<Array<String>>} An array of all guests that were successfully added. Empty is nothing is added.
         * @author Alexander Beck
         * @todo Possibly make an alias method in {@link Event}
         */
        async inviteGuests(event, ...guests) {
            if (!guests) return [];
            if (guests.length === 0) return [];
            if (!event) return false;

            // Check if added users is within guest limit
            // Assumes true if there is no guest limit
            const guestLimitCheck = event?.guestLimit ?
                (event.attendees?.length ?? 0) + guests.length < event.guestLimit : true;

            // Check to see if added users is within inviter limit
            // Assumes true if there is no inviter limit (or guest limit)
            const inviterLimitCheck = event?.inviterLimit ?
                ((await event.getInviteIdsByInviter(this))?.length ?? 0) + guests.length < event.inviterLimit : true;

            const eventLimit = guestLimitCheck && inviterLimitCheck;
            // If user is admin or user has PERMISSIONS.INVITE_TO_ALL_EVENTS
            const permFlag = this.permissions.includes(PERMISSIONS.INVITE_TO_ALL_EVENTS) && eventLimit;

            // Checks if user is on the event's allowedInviter list
            const userCanInviteToEvent = ((event?.allowedInviters && event.isUserAllowedToInvite(this)) ?? false) && eventLimit;

            if (this.accountType === ACCOUNT_TYPE.ADMIN || permFlag || userCanInviteToEvent) {
                // Check guest list to ensure that person is not already on it
                let successfullyAdded = [];
                // Has to be arrow notation; redefines 'this' otherwise
                guests.forEach(async (guest) => {
                    if (guest && !event.attendees.some(attendee => attendee.guest === guest)) {
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
                // Not allowed to invite guests
                return false;
            }
        },

        /**
         * @requires {@link PERMISSIONS.UNINVITE_TO_ALL_EVENTS}
         * @param {mongoose.Model} event The event to uninvite guests from
         * @param  {...String} guests The guests to uninvite
         * @returns {Promise<Boolean> | Promise<Array<String>>} A list of all the guests successfuly removed, an empty list if no users were removed, and false if the user does not have the permissions to uninvite any of the guests
         * @author Alexander Beck
         */
        async uninviteGuests(event, ...guests) {
            if (!event) return false;
            if (!guests) return false;
            if (guests.length === 0) return false;

            let successfullyRemoved = [];

            // Use hadPermissionAtLeastOnce to reduce redundant saves if the user was never allowed
            // to change anything in the first place. Ensures that false is returned if the user never
            // had the permissions, and [] is returned if the user had the permissions but nothing was changed
            let hadPermissionAtLeastOnce = false;

            guests.forEach(async (guest) => {
                // guest can also be undefined, which may cause an error.
                // Can be evaluated to undefined > 0 which is false
                const isInviter = event?.attendees?.filter(attendee =>
                    attendee.guest === guest && attendee.inviter === this)?.length > 0;

                const hasAllPerms = this?.permissions.includes(PERMISSIONS.UNINVITE_TO_ALL_EVENTS) ?? false;

                const isAllowedToInvite = (event?.allowedInviters && event.isUserAllowedToInvite(this)) ?? false;

                if (this.accountType === ACCOUNT_TYPE.ADMIN || hasAllPerms || isAllowedToInvite || isInviter) {
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
                // Not allowed to uninvite guests
                return false;
            }
        },

        /**
         * Note: Unlike other functions, makeAdmin does not work if a user is admin by default. The user **must**
         * have {@link PERMISSIONS.GIFT_ADMIN}.
         * @requires {@link PERMISSIONS.GIFT_ADMIN}
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
            // Not allowed to make a user admin
            return false;
        },

        /**
         * @returns {Promise<Array<mongoose.Model>} A list of events, or an empty array
         */
        async getUpcomingEvents() {
            const events = await Event.getUpcomingEvents(this);
            const user = this;

            return await Promise.all(events.map(async function (event) {
                const userInvites = (await event.getInviteIdsByInviter(user))?.length ?? 0;
                return {
                    ...hideFieldsFromObject(
                        event.toObject(), 'attendees', 'id'),
                    userInvites
                };
            }));
        },

        /**
         * Used for the front end. Will return a list of guests, with their full names.
         * @example await user.getInvitedGuests(christmasParty);
         * @param {mongoose.Model} event The event to get the guests from
         * @returns {Promise<Array<String>> | Promise<Boolean>} A list of names of invited guests or false if the event is empty
         * @author Alexander Beck
         */
        async getInvitedGuests(event) {
            // Used for frontend
            if (!event) return false;
            const thisFullName = await this.fullName;
            return Promise.all((await event.getInvitesByInviter(this)).map(async (invite) => {
                const guestName = typeof invite === 'string' ? invite : await invite.fullName;
                return { guest: guestName, invitedBy: thisFullName };
            }));
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
 * @author Alexander Beck
 * @requires firstName, lastName, username
 * @example
 * 
 *          // Inserting data
 *          const user = await User.create({
 *              firstName: 'Jane',
 *              lastName: 'Doe',
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
 * Used for when the server needs to add permissions to a user. Not an ideal way of doing things, but it works.
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
            await user.save()
            if (isServer) {
                // Only create a log if the server ran it
                await Logger.create({
                    action: EVENTS.MODIFY_PERMISSIONS,
                    target: user
                });
            }
            return true;
        } catch (err) {
            console.log(err);
        }
    }
    return false;
}