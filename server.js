/* eslint-disable no-undef */

import dotenv from 'dotenv';
import express, { json } from 'express';
import mongoose from 'mongoose';
import ViteExpress from 'vite-express';
import { createDummyUsers } from './dbTester.js';
import jwt from 'jsonwebtoken';

import Account from './models/account.js';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from './passport.js';
import cors from 'cors';
import User, { ACCOUNT_TYPE } from './models/user.js';
import Event from './models/event.js';

const app = express();
const port = 3000;

app.use(json());
dotenv.config();

//Account code
app.use(cors());
//app.use(express.static("dist"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
ViteExpress.config({ mode: 'development' });

app.use(session({
    secret: '5O$5HP^xg2zV0duE',     //MAKE A NEW KEY EVENTUALLY AND MOVE TO .ENV
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect to the database
connectToDB().catch(err => console.log(err));


// Register Route
app.post('/register', async (req, res) => {
    try {
        // Check for existing username
        const existingUser = await Account.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Username already exists" });
        }

        const newAccount = await Account.create({
            username: req.body.username,
            password: req.body.password
        });

        await User.createUser(newAccount, {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        res.json({ success: true, message: "Registration successful" });
    } catch (error) {
        console.error("Registration error: ", error);
        res.status(500).json({ success: false, message: ("Registration error: " + error.message) });
    }
});

//login route
app.post('/login', passport.authenticate('local', { failureMessage: true }), async (req, res) => {
    const user = await Account.findOne({ username: req.body.username });
    if (!user)
        return res.status(404).json({ success: false, message: "User not found" });

    const token = generateToken(user);
    res.setHeader('Authorization', `Bearer ${token}`);
    res.json({ success: true, token, message: "Login successful" });
});

function generateToken(user) {
    const payload = {
        username: user.username,
    };

    return jwt.sign(payload, "9s68zYkVaXeZ@aSnpc42CKY%%aWXrJp$$mFeWKE!!", { expiresIn: '1h' });     //MAKE A NEW KEY EVENTUALLY AND MOVE TO .ENV
}

//Token stored in localStorage
function getUsernameFromToken(token) {
    try {
        const decoded = jwt.decode(token, "9s68zYkVaXeZ@aSnpc42CKY%%aWXrJp$$mFeWKE!!");
        const username = decoded.username;

        return username;
    } catch (error) {
        console.log("Failed to get username from token");
    }
}

/*
#################################################
API ENDPOITNS
#################################################
*/
app.post('/api/verifyToken', (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            // If token is null
            // Prevent jwt.verify throwing an error and cluttering the console
            // This can be removed if the console.log is removed from the catch
            return res.json({ valid: false });
        }
        const decoded = jwt.verify(token, "9s68zYkVaXeZ@aSnpc42CKY%%aWXrJp$$mFeWKE!!");
        console.log(decoded)

        if (decoded.exp < Date.now() / 1000)
            return res.json({ valid: false });

        return res.json({ valid: true });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log('Token expired.');
        } else {
            console.error(error)
        }
        return res.json({ valid: false });
    }
});

app.post('/api/verifyAdmin', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            // If token is null
            // Prevent jwt.verify throwing an error and cluttering the console
            // This can be removed if the console.log is removed from the catch
            return res.json({ valid: false });
        }
        const decoded = jwt.verify(token, "9s68zYkVaXeZ@aSnpc42CKY%%aWXrJp$$mFeWKE!!");

        if (decoded.exp < Date.now() / 1000)
            return res.json({ valid: false });

        const user = await User.findOne({ username: decoded.username });
        const isAdmin = user.accountType === ACCOUNT_TYPE.ADMIN;
        return res.json({ valid: isAdmin });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log('Token expired.');
        } else {
            console.error(error)
        }
        return res.json({ valid: false });
    }
});


app.post('/api/getUsernameFromToken', (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.decode(token, "9s68zYkVaXeZ@aSnpc42CKY%%aWXrJp$$mFeWKE!!");
        const username = decoded.username;

        console.log(username)
        return res.json({ username });
    } catch (error) {
        return res.json({ error: "Failed to get username from token" });
    }
});


app.post('/api/getUpcomingEvents', async (req, res) => {
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

app.post('/api/getProfile', async (req, res) => {
    try {
        const { token } = req.body;
        const username = getUsernameFromToken(token);
        const profile = await User.findOne({ username: username }).select('fullName username accountType prettyAccountType').populate('firstName lastName').exec();

        // Why does this double fire?
        return res.json(hideFieldsFromObject(
            renameFieldInObject(hideFieldsFromObject(profile.toObject(), 'accountType'),
                'prettyAccountType', 'accountType'),
            'id', '_id'));
    } catch (err) {
        console.log(err);
        return res.json({ error: "Failed to authenticate token" });
    }
});

app.post('/api/getGuestList', async (req, res) => {
    try {
        const { token, eventName } = req.body;
        // Is not used, but will ensure that someone is logged in
        /* eslint-disable-next-line no-unused-vars */
        const username = getUsernameFromToken(token);

        // Doesn't really have a purpose, but will fail if the user isn't logged in I guess
        // const user = await User.findOne({ username: username });
        const event = await Event.findOne({ name: eventName });

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

app.post('/api/getUserGuestList', async (req, res) => {
    try {
        const { token, eventName } = req.body;
        // Is not used, but will ensure that someone is logged in
        /* eslint-disable-next-line no-unused-vars */
        const username = getUsernameFromToken(token);

        // Doesn't really have a purpose, but will fail if the user isn't logged in I guess
        // const user = await User.findOne({ username: username });
        const event = await Event.findOne({ name: eventName });
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

/**
 * eventBody: {
 *  name: String,
 *  date: String,
 *  location: String,
 *  guestLimit?: Int,
 *  inviterLimit?: Int
 * }
 * 
 * 		try {
            const eventBody = {
                name: 'My Temp Event',
                location: 'The White House',
                date: new Date(Date.now() + 20 * 60 * 60 * 1000)
            }
            const response = await fetch('//localhost:3000/api/createEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: localStorage.getItem('token'),
                    eventBody: eventBody
                }),
            });

            const events = await response.json();
            console.log(events);
        } catch (error) {
            console.error('Error creating event:', error);
        }
 */
app.post('/api/createEvent', async (req, res) => {
    try {
        const { token, eventBody } = req.body;
        if (eventBody.name === undefined || eventBody.date === undefined || eventBody.location === undefined) {
            // Don't need to waste resources validating if the user is authenticated if the event
            // provided will fail regardless
            return res.json({ success: false, error: 'Recieved undefined value in eventBody' });
        }

        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        const eventExists = await Event.findOne({ name: eventBody.name });
        if (eventExists) {
            return res.json({ success: false, error: 'Event with this name already exists' });
        }
        const event = await user.createEvent(eventBody);

        return res.json(hideFieldsFromObject(event.toObject(), 'id', '_id', 'attendees'));
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

app.post('/api/deleteEvent', async (req, res) => {
    try {
        const { token, eventName } = req.body;
        if (eventName === undefined) {
            return res.json({ success: false, error: 'eventName is undefined' });
        }

        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        const eventExists = await Event.findOne({ name: eventName });
        if (!eventExists || eventExists === undefined) {
            return res.json({ success: false, error: 'Event with this name not found' });
        }

        const eventDeleted = await user.deleteEvent(eventName);

        return res.json({ success: eventDeleted });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

app.post('/api/modifyEvent', async (req, res) => {
    try {
        const { token, eventBody } = req.body;
        if (eventBody.name === undefined) {
            // Don't need to waste resources validating if the user is authenticated if the event
            // provided will fail regardless
            return res.json({ success: false, error: 'Recieved an undefined eventBody.name' });
        }

        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        const event = await Event.findOne({ name: eventBody.id });

        const result = await user.modifyEvent(event, eventBody);
        if (typeof result === 'boolean' || result === undefined) {
            return res.json({ success: false });
        }

        return res.json(hideFieldsFromObject(event.toObject(), 'id', '_id', 'attendees'));
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

app.post('/api/setGuestLimit', async (req, res) => {
    try {
        const { token, eventName, guestLimit } = req.body;
        if (eventName === undefined || guestLimit === undefined) {
            return res.json({ success: false, error: 'eventName or guestList is undefined' });
        }

        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        const event = await Event.findOne({ name: eventName });
        if (!event || event === undefined) {
            return res.json({ success: false, error: 'Event with that name not found' });
        }

        const changeSuccess = await event.setGuestLimit(user, guestLimit);

        return res.json({ success: changeSuccess });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

app.post('/api/setInviteLimit', async (req, res) => {
    try {
        const { token, eventName, inviteLimit } = req.body;
        if (eventName === undefined || inviteLimit === undefined) {
            return res.json({ success: false, error: 'eventName or inviteLimit are undefined' });
        }

        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        const event = await Event.findOne({ name: eventName });
        if (!event || event === undefined) {
            return res.json({ success: false, error: 'Event with that name not found' });
        }

        const changeSuccess = await event.setInviteLimit(user, inviteLimit);

        return res.json({ success: changeSuccess });
    } catch (err) {
        console.log(err);
        return res.json({ success: false });
    }
});

app.post('/api/addAllowedInviter', async (req, res) => {
    try {
        const { token, eventName, inviterName } = req.body;
        if (eventName === undefined || inviterName === undefined) {
            return res.json({ success: false, error: 'eventName or inviterName is undefined' });
        }

        const username = getUsernameFromToken(token);

        const user = await User.findOne({ username: username });
        const event = await Event.findOne({ name: eventName });

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

app.post('/api/removeAllowedInviter', async (req, res) => {
    try {
        const { token, eventName, inviterName } = req.body;
        if (eventName === undefined || inviterName === undefined) {
            return res.json({ success: false, error: 'eventName or inviterName is undefined' });
        }

        const username = getUsernameFromToken(token);

        const user = await User.findOne({ username: username });
        const event = await Event.findOne({ name: eventName });

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

app.post('/api/inviteGuest', async (req, res) => {
    try {
        const { token, eventName, guestName } = req.body;
        if (eventName === undefined || guestName === undefined) {
            return res.json({ success: false, error: 'eventName or guestName is undefined' });
        }

        const username = getUsernameFromToken(token);

        const user = await User.findOne({ username: username });
        const event = await Event.findOne({ name: eventName });

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

app.post('/api/uninviteGuest', async (req, res) => {
    try {
        const { token, eventName, guestName } = req.body;
        if (eventName === undefined || guestName === undefined) {
            return res.json({ success: false, error: 'eventName or guestname is undefined' });
        }

        const username = getUsernameFromToken(token);

        const user = await User.findOne({ username: username });
        const event = await Event.findOne({ name: eventName });

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

/**
 * Returns the given object without the provided fields
 * @param {*} obj 
 * @param  {...String} fields The fields to remove from the object
 * @returns {*} The object without the given fields
 */
export function hideFieldsFromObject(obj, ...fields) {
    if (fields.length === 0) return obj;
    let newObj = obj;
    fields.forEach(field => {
        /* eslint-disable-next-line */
        const { [field]: ignore, ...rest } = newObj;
        newObj = rest;
    });
    return newObj;
}

/**
 * Does not mutlilate the object.
 * @param {*} obj 
 * @param  {String} oldFieldName The field to rename
 * @param {String} newFieldName The new name
 * @returns {*} The given object with field changed to newName
 */
export function renameFieldInObject(obj, oldFieldName, newFieldName) {
    if (!obj) return undefined;
    if (!oldFieldName || !newFieldName) return obj;

    const { [oldFieldName]: fieldValue, ...rest } = obj;
    return { [newFieldName]: fieldValue, ...rest };
}

/**
 * @description Connects to the MongoDB database using USER, PASS, and HOST in the .env file
 */
async function connectToDB() {
    const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
    await mongoose.connect(uri, { dbName: process.env.DBNAME });
}

ViteExpress.listen(app, process.env.PORT || port, () => {
    console.log("Server listening on port " + (process.env.PORT ? process.env.PORT : port));
});

/*
#################################################
WILL DELETE ENTIRE DB ON EVERY LOAD!!!!!!!!!!!!!!
Only keep when in DEVELOPMENT. 
#################################################
*/
// testDB();
await createDummyUsers();