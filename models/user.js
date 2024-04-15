import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Note: Not even closed to finished.
// Hasn't be debugged, tested, or anything of the like. 

/**
 * @author Whoever ends up implmeneting this schema
 * @todo Implement the schema
 */
const userSchema = new Schema({
    name: {
        type: String,
        minLength: 1,
        required: true,
    }
});

/**
 * @author Whoever ends up implmeneting this schema
 * @example
 *          // Inserting data
 *          const user = await User.create({
 *              fieldOne: 'FieldOnes data',
 *              boolOne: false,
 *              arrOne: ['item1', 'item2']
 *          });
 * 
 *          // Updating data
 *          user.fieldOne = 'FieldOnes updated data';
 *          await user.save();
 * 
 *          // Finding data
 *          const user = await User.findById("{id}").exec();
 * 
 *          // Getting only specific data
 *          const user = await User.findById("{id}", "fieldOne boolOne").exec();
 * 
 *          // Deleting data
 *          const user = await User.deleteOne({fieldOne: "FieldOne data"});
 *          const user = await User.deleteMany({fieldOne: "FieldOne data"});
 * @see {@link userSchema}
 */
const User = model('User', userSchema);

export default User;