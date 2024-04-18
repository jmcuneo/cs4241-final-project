import mongoose from 'mongoose';
import User, { ACCOUNT_TYPE, PERMISSIONS } from './user.js';
// import Logger from './actionlog.js';
const { Schema, model, SchemaTypes } = mongoose;

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
        required: true,
    },
    date: {
        // TODO: Date checking (cannot make events in the past?)
        type: Date,
        required: true
    },
    location: {
        type: String,
        minLength: [1, 'Event location must be at least 1 character long!'],
        required: true
    },
    creator: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        validate: {
            validator: async function (v) {
                // Ensure that creator has PERMISSIONS.CREATE_EVENT or is an admin
                const user = await User.findById(v);
                const hasAllPerms = user.permissions !== undefined && user.permissions.includes(PERMISSIONS.CREATE_EVENT);
                return user.accountType === ACCOUNT_TYPE.ADMIN || hasAllPerms;
            },
            // TODO: Make this message valid
            message: props => `The creator, ${props.value}, does not have permission to create events!`
        },
        required: true
    },
    guestLimit: {
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
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        },
        inviter: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            validate: {
                validator: async function (v) {
                    // Ensure that the inviter has PERMISSIONS.INVITE_TO_ALL_EVENTS
                    // or the inviter is an admin.
                    // Also ensure that the inviter isn't above their invite limit
                    // DOES NOT ASSUME THAT THE CREATOR IS ALLOWED TO INVITE.
                    const user = await User.findById(v);
                    const event = this.parent();
                    const isAdmin = user.accountType === ACCOUNT_TYPE.ADMIN;
                    // Pulled out from the big if statement to simplify
                    if (isAdmin) {
                        return true;
                    }
                    const hasAllPerms = user.permissions && user.permissions.includes(PERMISSIONS.INVITE_TO_ALL_EVENTS);
                    const isBelowGuestLimit = event && event.guestLimit ? event.attendees.length < event.guestLimit : true; // TODO test this
                    const previousInvites = await Event.countDocuments({ 'attendees.inviter': user }).exec(); // TODO Test this
                    const isBelowInviterLimit = event && event.guestList && event.guestLimit.inviterLimit ? previousInvites < event.guestLimit.inviterLimit : true; // TODO test this
                    return hasAllPerms && isBelowGuestLimit && isBelowInviterLimit;
                },
                // TODO: Make this message valid
                message: props => {
                    // const user = User.findById(props.value).exec();

                    // Why is this undefined??
                    // I give up.
                    // At least 4 hours trying to figure out how to get this to look at the guestList
                    // if (this.parent().guestLimit !== undefined) {
                    //     const isAboveGuestLimit = Event.countDocuments('attendees') > this.guestLimit;
                    //     if (isAboveGuestLimit) {
                    //         return `The inviter, ${props.value}, attempted to invite too many people. Guest list maximum reached.`;
                    //     }
                    //     const previousInvites = Event.countDocuments({ 'attendees.inviter': user }).exec(); // TODO Test this
                    //     const isAboveInviterLimit = Event.guestLimit.inviterLimit !== undefined ? previousInvites > Event.guestLimit.inviterLimit : true; // TODO test this
                    //     if (isAboveInviterLimit) {
                    //         return `The inviter, ${props.value}, attempted to exceed the inviter limit.`;
                    //     }
                    // }
                    return `The inviter, ${props.value}, does not have permission to invite people!`;
                }
            },
            required: true
        },
    }],
}, {
    timestamps: true,
    statics: {
        /**
         * @example
         *          // Get the number of people user invited to event (0 if no one has been invited)
         *          const userInviteCount = (await Event.getInvitesByUser(event, user))?.length ?? 0;
         * 
         *          // Gets every user in the event
         *          const usersInvited = await Promise.all((await Event.getInvitesByUser(event, this)).map(user => User.findById(user)));
         * 
         * @param {mongoose.Model} event The event to get the invites from
         * @param {mongoose.Model} user The inviter whom invited people
         * @returns {null | Promise<Array<mongoose.ObjectId>>} An array of the id's of users who were invited by the given user
         * @author Alexander Beck
         */
        async getInvitesByUser(event, user) {
            return (await this.findById(event._id).
                where('attendees.inviter').
                equals(user).
                select('attendees').
                exec())?.
                attendees.
                map(attendee => attendee.guest);
        }
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