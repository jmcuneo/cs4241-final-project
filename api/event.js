import express from 'express';
import mongoose from 'mongoose';
import Event from '../models/event.js';
import User from '../models/user.js';
import { getUsernameFromToken, hideFieldsFromObject, renameFieldInObject } from '../server.js';
const router = express.Router();

router.post('/getUpcomingEvents', async (req, res) => {
    try {
        const { token } = req.body;
        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        const events = await user.getUpcomingEvents();

        // Why does this double fire?
        return res.json(events);
    } catch (err) {
        console.log(err);
        return res.json({ error: "Failed to authenticate token" });
    }
});

router.post('/getEvent', async (req, res) => {
    try {
        const { token, eventId } = req.body;
        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        // Why does this double fire?
        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });
        if (!event || event === undefined || event === null) {
            return res.json({ success: false, error: 'Event with this id not found' });
        }
        const userInvites = (await event.getInviteIdsByInviter(user))?.length ?? 0;
        return res.json(hideFieldsFromObject({ userInvites: userInvites, ...event.toObject() }, 'id', 'attendees', 'allowedInviters'));
    } catch (err) {
        console.log(err);
        return res.json({ error: "Failed to authenticate token" });
    }
});

router.post('/createEvent', async (req, res) => {
    try {
        const { token, eventBody } = req.body;
        if (eventBody.name === undefined || eventBody.date === undefined || eventBody.location === undefined) {
            // Don't need to waste resources validating if the user is authenticated if the event
            // provided will fail regardless
            return res.json({ success: false, error: 'Recieved undefined value in eventBody' });
        }

        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        // const eventExists = await Event.findOne({ name: eventBody.name });
        // if (eventExists) {
        //     return res.json({ success: false, error: 'Event with this name already exists' });
        // }
        const event = await user.createEvent(eventBody);

        return res.json(hideFieldsFromObject(event.toObject(), 'id', 'attendees'));
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

router.post('/deleteEvent', async (req, res) => {
    try {
        const { token, eventId } = req.body;
        if (eventId === undefined) {
            return res.json({ success: false, error: 'eventId is undefined' });
        }

        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        const eventExists = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });
        if (!eventExists || eventExists === undefined) {
            return res.json({ success: false, error: 'Event with this id not found' });
        }

        const eventDeleted = await user.deleteEvent(mongoose.Types.ObjectId.createFromHexString(eventId));

        return res.json({ success: eventDeleted });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

router.post('/modifyEvent', async (req, res) => {
    try {
        const { token, eventBody } = req.body;
        if (eventBody._id === undefined) {
            // Don't need to waste resources validating if the user is authenticated if the event
            // provided will fail regardless
            return res.json({ success: false, error: 'Recieved an undefined eventBody._id' });
        }

        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        if (eventBody.date && new Date(eventBody.date) <= new Date()) {
            return res.json({ success: false, error: 'Date must not be in the past!' });
        }

        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventBody._id) });
        if (!event || event === undefined || event === null) {
            return res.json({ success: false, error: 'Event with that name not found' });
        }

        if (eventBody.guestLimit && event.hasMoreGuestsThanLimit(eventBody.guestLimit)) {
            return res.json({ success: false, error: 'Guest limit error' });
        }

        if (eventBody.inviteLimit && await event.hasInviterOverInviterLimit(eventBody.inviteLimit)) {
            return res.json({ success: false, error: 'Invite limit error' });
        }

        const result = await user.modifyEvent(event, eventBody);
        if (typeof result === 'boolean' || result === undefined) {
            return res.json({ success: false });
        }

        return res.json(hideFieldsFromObject(event.toObject(), 'id', 'creator', 'allowedInviters', 'attendees'));
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

router.post('/setGuestLimit', async (req, res) => {
    try {
        const { token, eventId, guestLimit } = req.body;
        if (eventId === undefined) {
            return res.json({ success: false, error: 'eventId is undefined' });
        }
        if (guestLimit === undefined) {
            return res.json({ success: false, error: 'guestLimit is undefined' });
        }

        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });
        if (!event || event === undefined) {
            return res.json({ success: false, error: 'Event with that name not found' });
        }

        if (event.hasMoreGuestsThanLimit(guestLimit)) {
            return res.json({ success: false, error: 'Guest limit is less than the number of guests' });
        }

        const changeSuccess = await event.setGuestLimit(user, guestLimit);

        return res.json({ success: changeSuccess });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

router.post('/getGuestLimit', async (req, res) => {
    try {
        const { token, eventId } = req.body;
        if (eventId === undefined) {
            return res.json({ success: false, error: 'eventId is undefined' });
        }

        const username = getUsernameFromToken(token);
        /* eslint-disable-next-line no-unused-vars */
        const user = await User.findOne({ username: username });

        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });
        if (!event || event === undefined) {
            return res.json({ success: false, error: 'Event with that name not found' });
        }

        const guestLimit = event.guestLimit;

        return res.json({ guestLimit: guestLimit });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

router.post('/setInviteLimit', async (req, res) => {
    try {
        const { token, eventId, inviteLimit } = req.body;
        if (eventId === undefined) {
            return res.json({ success: false, error: 'eventId is undefined' });
        }
        if (inviteLimit === undefined) {
            return res.json({ success: false, error: 'inviteLimit are undefined' });
        }

        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });
        if (!event || event === undefined || event === null) {
            return res.json({ success: false, error: 'Event with that name not found' });
        }

        if (await event.hasInviterOverInviterLimit(inviteLimit)) {
            return res.json({ success: false, error: 'An inviter is above the invite limit' });
        }

        const changeSuccess = await event.setInviterLimit(user, inviteLimit);

        return res.json({ success: changeSuccess });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

router.post('/getInviteLimit', async (req, res) => {
    try {
        const { token, eventId } = req.body;
        if (eventId === undefined) {
            return res.json({ success: false, error: 'eventId is undefined' });
        }

        const username = getUsernameFromToken(token);
        /* eslint-disable-next-line no-unused-vars */
        const user = await User.findOne({ username: username });

        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });
        if (!event || event === undefined || event === null) {
            return res.json({ success: false, error: 'Event with that name not found' });
        }

        const inviteLimit = event.inviteLimit;

        return res.json({ inviteLimit: inviteLimit });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

router.post('/getGuestAndInviteLimits', async (req, res) => {
    try {
        const { token, eventId } = req.body;
        if (eventId === undefined) {
            return res.json({ success: false, error: 'eventId is undefined' });
        }

        const username = getUsernameFromToken(token);
        /* eslint-disable-next-line no-unused-vars */
        const user = await User.findOne({ username: username });

        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });
        if (!event || event === undefined || event === null) {
            return res.json({ success: false, error: 'Event with that name not found' });
        }

        const guestLimit = event.guestLimit;
        const inviterLimit = event.inviterLimit;

        return res.json({ guestLimit: guestLimit, inviteLimit: inviterLimit });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

router.post('/getGuestList', async (req, res) => {
    try {
        const { token, eventId } = req.body;
        // Is not used, but will ensure that someone is logged in
        /* eslint-disable-next-line no-unused-vars */
        const username = getUsernameFromToken(token);

        // Doesn't really have a purpose, but will fail if the user isn't logged in I guess
        // const user = await User.findOne({ username: username });
        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });
        if (!event || event === undefined || event === null) {
            return res.json({ success: false, error: 'Event with that name not found' });
        }

        const uncleanedGuestList = await event.getGuestList();
        const guestList = uncleanedGuestList.map(guest => {
            return renameFieldInObject(hideFieldsFromObject(guest, 'id', '_id'), 'guest', 'guestName');
        });

        return res.json(guestList);
    } catch (err) {
        console.log(err);
        return res.json({ error: "Failed to authenticate token" });
    }
});

router.post('/getUserGuestList', async (req, res) => {
    try {
        const { token, eventId } = req.body;
        const username = getUsernameFromToken(token);

        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });
        if (!event || event === undefined || event === null) {
            return res.json({ success: false, error: 'Event with that name not found' });
        }

        const user = await User.findOne({ username: username });

        const guestList = (await user.getInvitedGuests(event)).map(guest => {
            return renameFieldInObject(hideFieldsFromObject(guest, 'id', '_id'), 'guest', 'guestName');
        });

        return res.json(guestList);
    } catch (err) {
        console.log(err);
        return res.json({ error: "Failed to authenticate token" });
    }
});

export default { router };