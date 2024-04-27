import mongoose from 'mongoose';
import User, { ACCOUNT_TYPE, PERMISSIONS } from './user.js';
import Logger, { EVENTS } from './actionlog.js';
const { Schema, model } = mongoose;

/**
 * @author Alexander Beck
 * @todo Validate attendees, permission checking, add creator to attendee list
 * 
 * KNOWN BUG: attendees.inviter.message will NOT give the correct error message. You have been warned.
 */
const eventSchema = new Schema({
    name: {
        type: String,
        minLength: [1, 'Event name must be at least 1 character long!'],
        unique: true,
        required: true,
    },
    date: {
        type: Date,
        validate: {
            validator: async function (v) {
                // Simply checks if the date is in the future
                return v > new Date();
            },
            message: 'The date for the event, {VALUE}, must not be in the past!'
        },
        required: true
    },
    location: {
        type: String,
        minLength: [1, 'Event location must be at least 1 character long!'],
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: async function (v) {
                // Ensure that creator has PERMISSIONS.CREATE_EVENT or is an admin
                const user = await User.findById(v);
                const hasAllPerms = user?.permissions && user.permissions.includes(PERMISSIONS.CREATE_EVENT);
                return user.accountType === ACCOUNT_TYPE.ADMIN || hasAllPerms;
            },
            // TODO: Make this message valid
            message: props => `The creator, ${props.value}, does not have permission to create events!`
        },
        required: true
    },
    guestLimit: {
        // TODO: Do NOT include users as guests
        type: Number,
        min: [0, 'Guest Limit must be greater than 0, got {VALUE}'],
    },
    inviterLimit: {
        type: Number,
        min: [0, 'Inviter Limit must be greater than 0, got {VALUE}'],
        validate: {
            validator: function (v) {
                if (this.guestLimit !== undefined) {
                    return v <= this.guestLimit;
                }
                return v >= 0;
            },
            message: 'Cannot set the inviter limit to be greater than the guest limit! Recieved VALUE'
        },
    },
    attendees: [{
        guest: {
            type: mongoose.Schema.Types.Mixed,
            validate: {
                validator: function (v) {
                    return typeof v === 'string' || v instanceof mongoose.Types.ObjectId;
                },
                message: '{VALUE} is not a proper guest type!'
            },
            ref: function () {
                return this.guest instanceof mongoose.Types.ObjectId ? 'User' : undefined;
            },
            required: true
        },
        inviter: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            validate: {
                validator: async function (v) {
                    // Ensure that the inviter has PERMISSIONS.INVITE_TO_ALL_EVENTS
                    // or the inviter is an admin.
                    // Also ensure that the inviter isn't above their invite limit
                    const user = await User.findById(v);
                    const event = this.parent();
                    const isAdmin = user.accountType === ACCOUNT_TYPE.ADMIN;
                    // Pulled out from the big if statement to simplify
                    if (isAdmin) {
                        return true;
                    }
                    const hasAllPerms = user.permissions && user.permissions.includes(PERMISSIONS.INVITE_TO_ALL_EVENTS);
                    const canInviteToEvent = event.allowedInviters && event.isUserAllowedToInvite(user);
                    const isBelowGuestLimit = event && event.guestLimit ? event.attendees.length < event.guestLimit : true; // TODO test this
                    const previousInvites = (await event.getInvitesByInviter(user)).length
                    const isBelowInviterLimit = event && event.inviterLimit ? previousInvites < event.inviterLimit : true; // TODO test this
                    return (hasAllPerms || canInviteToEvent) && isBelowGuestLimit && isBelowInviterLimit;
                },
                // TODO: Make this message valid
                message: props => `The inviter, ${props.value}, does not have permission to invite people!`
            },
            required: true
        },
    }],
    allowedInviters: {
        // Weird format of allowedInviters but I had to do this to
        // be able to access this.creator
        type: [{
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        }],
        default: function () {
            // Default the allowedInviters to include the creator
            return this.creator ? [this.creator] : [];
        },
    },
}, {
    timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true },
    virtuals: {
        guestCount: {
            type: String,
            get() {
                return this?.attendees?.length ?? 0;
            }
        }
    },
    statics: {
        /**
         * Can be refactored to use a query instead of a static. Consider looking into which is more efficient.
         * @example
         *          // Get the number of people user invited to event (0 if no one has been invited)
         *          const userInviteCount = (await Event.getInviteIdsByInviter(event, user))?.length ?? 0;
         * 
         *          // Gets every user in the event
         *          const usersInvited = await Promise.all((await Event.getInviteIdsByInviter(event, this)).map(user => User.findById(user)));
         * 
         * @param {mongoose.Model} event The event to get the invites from
         * @param {mongoose.Model} user The inviter whom invited people
         * @returns {null | Promise<Array<mongoose.ObjectId>>} An array of the id's of users who were invited by the given user
         * @author Alexander Beck
         */
        async getInviteIdsByInviter(event, user) {
            if (!event || !user) return [];
            const foundEvent = await this.findOne({ _id: event._id });
            return foundEvent?.
                attendees.filter(attendee => attendee.inviter.equals(user._id)).
                map(attendee => attendee.guest);
        },

        /**
         * @param {mongoose.Types.Model} event The event to get the guest list from
         * @returns {Promise<Boolean> | Promise<Array<Object>>} The guest list of the event, false if the event is undefined, or [] if there are no attendees
         * @author Alexander Beck
         */
        async getGuestList(event) {
            if (!event) return [];
            const guestList = await this.findById(event._id).
                select('attendees').populate('attendees.inviter').exec();
                // TODO: Sending ObjectIds if it is a user. Try to fix this.
            return guestList?.attendees.map(attendee => {
                // Populate inviter but hide everything other than fullName
                const { inviter, ...rest } = attendee.toObject();
                const { fullName } = inviter;
                return { invitedBy: fullName, ...rest };
            }) ?? [];
        },

        /**
         * Does nothing with the current user parameter. It is in place for the event that the application is expanded to allow different organizations with different event scopes
         * @param {mongoose.Model} user The user to get upcoming events of (note: does nothing with it currently)
         * @returns {Promise<Array<mongoose.Model>} A list of events, or an empty array
         * @author Alexander Beck
         */
        /* eslint-disable-next-line no-unused-vars */
        async getUpcomingEvents(user) {
            // if (!user) return [];
            const currentDate = new Date().toISOString();
            return (await this.
                where('date').gte(currentDate).select('name date location attendees guestCount').populate('attendees').exec()
            );
        },
    },
    methods: {
        /**
         * Simply calls {@link Event.getInviteIdsByInviter}. 
         * @example
         *          // Get the number of people user invited to event (0 if no one has been invited)
         *          const userInviteCount = (await event.getInviteIdsByInviter(user))?.length ?? 0;
         * 
         *          // Gets every user in the event
         *          const usersInvited = await Promise.all((await event.getInviteIdsByInviter(this)).map(user => User.findById(user)));
         * 
         *          // It is preferred if you use this:
         *          await event.getInvitesByInviter(user);
         * 
         * @param {mongoose.Model} inviter The inviter whom invited people
         * @returns {null | Promise<Array<mongoose.ObjectId>>} An array of the id's of users who were invited by the given user
         * @author Alexander Beck
         * @see {@link Event.getInviteIdsByInviter}
         */
        async getInviteIdsByInviter(inviter) {
            return await Event.getInviteIdsByInviter(this, inviter);
        },

        /**
         * @param {mongoose.Model} inviter The inviter to get the invites from
         * @returns {Promise<Array<mongoose.Model> | Array<String>>}
         * @author Alexander Beck
         */
        async getInvitesByInviter(inviter) {
            const invites = await this.getInviteIdsByInviter(inviter);
            return invites ? await Promise.all(invites.map(user => user instanceof mongoose.Types.ObjectId ? User.findById(user) : user)) : [];
        },

        /**
         * @returns {Promise<Boolean> | Promise<Array<Object>>} The guest list of the event, false if the event is undefined, or [] if there are no attendees
         * @author Alexander Beck
         */
        async getGuestList() {
            return await Event.getGuestList(this);
        },

        /**
         * Check if the user is on the allowedInviters list
         * @param {mongoose.Types.ObjectId | mongoose.Model} user The user to check
         * @returns {Boolean} A boolean representing if the user is on the allowedInviters list 
         * @author Alexander Beck
         */
        isUserAllowedToInvite(user) {
            const userId = user instanceof mongoose.Types.ObjectId ? user : user._id;
            return this.allowedInviters.some(allowedInviter => allowedInviter.equals(userId));
        },

        /**
         * @param {mongoose.Model} user The user setting the guest limit
         * @param {Number} guestLimit A non-negative number. The new guest limit to set to. 0 to remove the guest limit
         * @returns {Promise<Boolean>} A boolean representing if the guest limit was successfully changed
         * @author Alexander Beck
         */
        async setGuestLimit(user, guestLimit) {
            // Why this is in event.js instead of user.js? I have no idea.
            // Should it be in user.js? Probably.
            // Am I going to change it? I might. But probably not.
            if (!user || user === undefined) return false;
            if (guestLimit === undefined) return false;

            if (user.accountType === ACCOUNT_TYPE.ADMIN || user.permissions.includes(PERMISSIONS.MODIFY_EVENTS) || this.creator === user._id) {
                if (guestLimit === 0) {
                    // Remove guest limit
                    return await this.removeGuestLimit(user);
                } else if (guestLimit < 0) {
                    // guestLimit should not be negative
                    return false;
                }
                this.guestLimit = guestLimit;
                try {
                    await this.save();
                    await Logger.create({
                        action: EVENTS.MODIFY_EVENT,
                        subject: user,
                        event: this
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
         * @param {mongoose.Model} user The user removing the guest list
         * @returns {Promise<Boolean>} A boolean representing if the guest limit was successfully removed
         * @author Alexander Beck
         */
        async removeGuestLimit(user) {
            if (!user) return false;
            if (user.accountType === ACCOUNT_TYPE.ADMIN || user.permissions.includes(PERMISSIONS.MODIFY_EVENTS) || this.creator === user._id) {
                this.guestLimit = undefined;
                try {
                    await this.save();
                    await Logger.create({
                        action: EVENTS.MODIFY_EVENT,
                        subject: user,
                        event: this
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
          * @param {mongoose.Model} user The user setting the inviter limit
          * @param {Number} inviterLimit A non-negative number. The new inviter limit to set to. 0 to remove the inviter limit
          * @returns {Promise<Boolean>} A boolean representing if the inviter limit was successfully changed
          * @author Alexander Beck
          */
        async setInviterLimit(user, inviterLimit) {
            // Why this is in event.js instead of user.js? I have no idea.
            // Should it be in user.js? Probably.
            // Am I going to change it? I might. But probably not.
            // Is this function just a copy of setGuestLimit? Yes.
            if (!user) return false;

            // This is the exact same thing as removeInviterLimit, but doing this forces the code
            // to be more readable (removeInviterLimit(user) instead of setInviterLimit(user))
            if (inviterLimit === undefined) return false;

            if (user.accountType === ACCOUNT_TYPE.ADMIN || user.permissions.includes(PERMISSIONS.MODIFY_EVENTS) || this.creator === user._id) {
                if (inviterLimit === 0) {
                    // Remove inviter limit
                    return await this.removeInviterLimit(user);
                } else if (inviterLimit < 0) {
                    // inviterLimit should not be negative
                    return false;
                }
                this.inviterLimit = inviterLimit;
                try {
                    await this.save();
                    await Logger.create({
                        action: EVENTS.MODIFY_EVENT,
                        subject: user,
                        event: this
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
         * @param {mongoose.Model} user The user removing the inviter list
         * @returns {Promise<Boolean>} A boolean representing if the inviter limit was successfully removed
         * @author Alexander Beck
         */
        async removeInviterLimit(user) {
            if (!user) return false;
            if (user.accountType === ACCOUNT_TYPE.ADMIN || user.permissions.includes(PERMISSIONS.MODIFY_EVENTS) || this.creator === user._id) {
                this.inviterLimit = undefined;
                try {
                    await this.save();
                    await Logger.create({
                        action: EVENTS.MODIFY_EVENT,
                        subject: user,
                        event: this
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
});

/**
 * @author Alexander beck
 * @example
 *          // DO NOT FOLLOW THIS UNTIL I REMOVE THIS MESSAGE,
 *          // IT MEANS I HAVE FORGOTTEN TO IMPLEMENT NEW EXAMPLES
 * 
 *          // Inserting data
 * 
 *          // Make sure to verify that the user has permissiosn before creating the event!
 *          
 *          const event = await Event.create({
 *              name: 'My Event',
 *              date: new Date(2024, 11, 25),
 *              location: 'Unity 520',
 *              creator: user._userId,
 *          });
 * 
 *          // The non-server-side way of doing it:
 *          const event = await user.createEvent({
 *              name: 'My Event',
 *              date: new Date(2024, 11, 25),
 *              location: 'Unity 520'
 *          });
 * 
 *          // Updating data
 *          event.location = 'Unity 500';
 *          await event.save(); // When you are finished making changes
 *  
 *          // Bulk Updating Data 
 *          const christmasParty = await Event.create({
 *              name: 'Christmas Party',
 *              date: new Date(2024, 11, 25),
 *              location: 'Unity 520',
 *              creator: user
 *          });
 * 
 *          christmasParty.attendees.addToSet(
 *              { guest: user2, inviter: user },
 *              { guest: user3, inviter: user });
 *          await christmasParty.save();
 *  
 *          // Finding data
 *          const event = await Event.findById("{id}").exec();
 *          // or
 *          const event = await Event.findOne({_id: {id}})
 *          
 *          // Getting only specific data
 *          const event = await Event.findById("{id}", "fieldOne boolOne").exec();
 * 
 *          // Deleting data
 *          const event = await Event.deleteOne({fieldOne: "FieldOne data"});
 *          const event = await Event.deleteMany({fieldOne: "FieldOne data"});
 * @see {@link eventSchema}, {@link Date}
 */
const Event = model('Event', eventSchema, 'Events');

export default Event;