import { Schema, SchemaTypes, model } from "mongoose";

// README: I have no intentions of having this log accessable by the frontend.
// It is for debugging/management purposes only

/**
 * @author Alexander Beck
 */
export const EVENTS = Object.freeze({
    JOIN: 'JOIN',
    INVITE_USER: 'INVITE_USER',
    UNINVITE_USER: 'UNINVITE_USER',
    MODIFY_USER: 'MODIFY_USER',
    CREATE_EVENT: 'CREATE_EVENT',
    DELETE_EVENT: 'DELETE_EVENT',
    MODIFY_EVENT: 'MODIFY_EVENT',
    MODIFY_PERMISSIONS: 'MODIFY_PERMISSIONS',
    MAKE_ADMIN: 'MAKE_ADMIN'
});

/**
 * @author Alexander Beck
 */
const actionLogSchema = new Schema({
    action: {
        type: String,
        enum: {
            values: Object.values(EVENTS),
            message: 'VALUE is not a valid log action!'
        },
        required: true,
    },
    subject: {
        type: SchemaTypes.ObjectId,
        ref: 'User'
    },
    target: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
    },
    event: {
        type: SchemaTypes.ObjectId,
        ref: 'Event',
    },
}, { timestamps: true });

/**
 * @author Alexander Beck
 */
const Logger = model('Action Log', actionLogSchema, 'ActionLogs');

export default Logger;