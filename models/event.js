import mongoose from 'mongoose';
import User, { ACCOUNT_TYPE, PERMISSIONS } from './user.js';
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
        inviterLimit: {
            type: Number,
            min: [0, 'Inviter Limit must be greater than 0, got {VALUE}'],
            // TODO: Test if this max is working properly
            max: [this, 'Invited Limit cannot be greater than the guest limit, got {VALUE}']
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
                    const previousInvites = (await event.getInvitesByInviter(user)).length // TODO Test this
                    const isBelowInviterLimit = event && event.guestList && event.guestLimit.inviterLimit ? previousInvites < event.guestLimit.inviterLimit : true; // TODO test this
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
                return this.attendees.length;
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
            return (await this.findById(event._id).
                where('attendees.inviter').
                equals(user).
                select('attendees').
                exec())?.
                attendees.
                map(attendee => attendee.guest);
        },

        /**
         * @param {mongoose.Types.Model} event The event to get the guest list from
         * @returns {Promise<Boolean> | Promise<Array<Object>>} The guest list of the event, false if the event is undefined, or [] if there are no attendees
         * @author Alexander Beck
         */
        async getGuestList(event) {
            if (!event) return [];
            return (await this.findById(event._id).
                select('attendees').exec())?.
                attendees ?? [];
        },

        /**
         * @param {mongoose.Model} user The user to get upcoming events of (note: does nothing with it currently)
         * @returns {Promise<Array<mongoose.Model>} A list of events, or an empty array
         */
        /* eslint-disable-next-line no-unused-vars */
        async getUpcomingEvents(user) {
            // if (!user) return [];
            const currentDate = new Date().toISOString();
            return (await this.
                where('date').gte(currentDate)
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
         * @param {mongoose.Model} user The inviter whom invited people
         * @returns {null | Promise<Array<mongoose.ObjectId>>} An array of the id's of users who were invited by the given user
         * @author Alexander Beck
         * @see {@link Event.getInviteIdsByInviter}
         */
        async getInviteIdsByInviter(user) {
            return await Event.getInviteIdsByInviter(this, user);
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
         */
        isUserAllowedToInvite(user) {
            const userId = user instanceof mongoose.Types.ObjectId ? user : user._id;
            return this.allowedInviters.some(allowedInviter => allowedInviter.equals(userId));
        },

        async setGuestLimit() {
            throw ReferenceError('Not yet implemented!');
        },

        async setInviterLimit() {
            throw ReferenceError('Not yet implemented!');
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