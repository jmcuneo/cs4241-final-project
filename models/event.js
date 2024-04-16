import mongoose from 'mongoose';
const { Schema, model, SchemaTypes } = mongoose;

// Note: Not even closed to finished.
// Hasn't be debugged, tested, or anything of the like. 

/**
 * @author Alexander Beck
 * @todo Validate attendees, check if user has permission before creating event
 */
const eventSchema = new Schema({
    name: {
        type: String,
        minLength: [1, 'Event name must be at least 1 character long!'],
        required: true,
    },
    date: {
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
            validator: function () {
                // Ensure that creator has PERMISSIONS.CREATE_EVENT or is an admin
                return true;
            },
            // TODO: Make this message valid
            message: props => `The creator, ${props.value}, does not have permission to create events!`
        },
        required: true
    },
    // TODO: Validate that attendees is set up properly (I have no idea if it is properly referencing a User)
    attendees: [{
        guest: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true // Is this necessary?
        },
        inviter: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            validate: {
                validator: function () {
                    // Ensure that the inviter is in the allowed inviters,
                    // has PERMISSIONS.INVITE_TO_ALL_EVENTS, or the inviter is an admin.
                    // Also ensure that the inviter isn't above their invite limit
                    return true
                },
                // TODO: Make this message valid
                message: props => `The inviter, ${props.value}, does not have permission to invite people!`
            }
        },
    }],
    guestLimit: {
        type: Number,
        min: [0, 'Guest Limit must be greater than 0, got {VALUE}'],
        inviterLimit: {
            type: Number,
            min: [0, 'Inviter Limit must be greater than 0, got {VALUE}'],
            required: false
        },
    }
}, { timestamps: true });

// TODO: Implement this
eventSchema.virtual('guestCount').get(function () {
    return this.attendees.length;
});

/**
 * @author Alexander beck
 * @example
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