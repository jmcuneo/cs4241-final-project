import mongoose from 'mongoose';
const { Schema, model, SchemaTypes } = mongoose;

// Note: Not even closed to finished.
// Hasn't be debugged, tested, or anything of the like. 

/**
 * @author Whoever ends up implmeneting this schema
 * @todo Implement the schema
 */
const eventSchema = new Schema({
    eventName: {
        type: String,
        minLength: 1,
        required: true,
    },
    attendees: [{
        user: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true // Is this necessary?
        }
    }]
});

/**
 * @author Whoever ends up implmeneting this schema
 * @example
 *          // Inserting data
 *          const event = await Event.create({
 *              fieldOne: 'FieldOnes data',
 *              boolOne: false,
 *              arrOne: ['item1', 'item2']
 *          });
 * 
 *          // Updating data
 *          event.fieldOne = 'FieldOnes updated data';
 *          await event.save();
 * 
 *          // Finding data
 *          const event = await Event.findById("{id}").exec();
 * 
 *          // Getting only specific data
 *          const event = await Event.findById("{id}", "fieldOne boolOne").exec();
 * 
 *          // Deleting data
 *          const event = await Event.deleteOne({fieldOne: "FieldOne data"});
 *          const event = await Event.deleteMany({fieldOne: "FieldOne data"});
 * @see {@link eventSchema}
 */
const Event = model('Event', eventSchema);

export default Event;