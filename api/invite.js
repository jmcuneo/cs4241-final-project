import express from 'express';
import mongoose from 'mongoose';
import Event from '../models/event.js';
import User from '../models/user.js';
import { getUsernameFromToken } from '../server.js';
const router = express.Router();

router.post('/inviteGuest', async (req, res) => {
    try {
        const { token, eventId, guestName } = req.body;
        if (eventId === undefined || guestName === undefined) {
            return res.json({ success: false, error: 'eventId or guestName is undefined' });
        }

        const username = getUsernameFromToken(token);

        const user = await User.findOne({ username: username });
        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });

        const guestList = await event.getGuestList();
        const guestExists = guestList.filter(guest => guest.guest === guestName).length > 0;
        if (guestExists) {
            return res.json({ success: false, error: 'Guest with that name already exists' });
        }

        const userInvited = typeof (await user.inviteGuests(event, guestName)) !== 'boolean';
        return res.json({ success: userInvited });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

router.post('/uninviteGuest', async (req, res) => {
    try {
        const { token, eventId, guestName } = req.body;
        if (eventId === undefined || guestName === undefined) {
            return res.json({ success: false, error: 'eventId or guestname is undefined' });
        }

        const username = getUsernameFromToken(token);

        const user = await User.findOne({ username: username });
        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });

        const guestList = await event.getGuestList();
        const guestDoesNotExist = guestList.filter(guest => guest.guest === guestName).length === 0;
        if (guestDoesNotExist) {
            return res.json({ success: false, error: 'Guest does not already exist' });
        }

        const userUninvited = typeof (await user.uninviteGuests(event, guestName)) !== 'boolean';
        return res.json({ success: userUninvited });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: err });
    }
});

router.post('/addAllowedInviter', async (req, res) => {
    try {
        const { token, eventId, inviterName } = req.body;
        if (eventId === undefined || inviterName === undefined) {
            return res.json({ success: false, error: 'eventId or inviterName is undefined' });
        }

        const username = getUsernameFromToken(token);

        const user = await User.findOne({ username: username });
        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });
        if (event === null) {
            return res.json({ success: false, error: "Event not found" });
        }

        const inviter = await User.findOne({ username: inviterName });
        if (!inviter) {
            return res.json({ success: false, error: 'Inviter not found' });
        }

        const addedSuccessfully = await user.makeAllowedToInvite(event, inviter);
        return res.json({ success: addedSuccessfully });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

router.post('/removeAllowedInviter', async (req, res) => {
    try {
        const { token, eventId, inviterName } = req.body;
        if (eventId === undefined || inviterName === undefined) {
            return res.json({ success: false, error: 'eventId or inviterName is undefined' });
        }

        const username = getUsernameFromToken(token);

        const user = await User.findOne({ username: username });
        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });
        if (event === null) {
            return res.json({ success: false, error: "Event not found" });
        }

        const inviter = await User.findOne({ username: inviterName });
        if (!inviter) {
            return res.json({ success: false, error: 'Inviter not found' });
        }

        const removedSuccessfully = await user.makeUnableToInvite(event, inviter);
        return res.json({ success: removedSuccessfully });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

router.post('/getAllowedInviters', async (req, res) => {
    try {
        const { token, eventId } = req.body;
        if (eventId === undefined) {
            return res.json({ success: false, error: 'eventId is undefined' });
        }

        const username = getUsernameFromToken(token);

        const user = await User.findOne({ username: username });
        const event = await Event.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) });
        if (event === null) {
            return res.json({ success: false, error: "Event not found" });
        }

        const allowedInviters = await event.getAllowedInviters();
        return res.json(allowedInviters);
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});


export default { router };