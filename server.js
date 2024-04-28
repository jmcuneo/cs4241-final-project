/* eslint-disable no-undef */
import cors from 'cors';
import dotenv from 'dotenv';
import express, { json } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import ViteExpress from 'vite-express';

import bodyParser from 'body-parser';
import session from 'express-session';
import Account from './models/account.js';
import User from './models/user.js';
import passport from './passport.js';

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

export const JWT_KEY = "9s68zYkVaXeZ@aSnpc42CKY%%aWXrJp$$mFeWKE!!";

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

    return jwt.sign(payload, JWT_KEY, { expiresIn: '1h' });     //MAKE A NEW KEY EVENTUALLY AND MOVE TO .ENV
}

//Token stored in localStorage
export function getUsernameFromToken(token) {
    try {
        const decoded = jwt.decode(token, JWT_KEY);
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
async function importAllApis() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const apis = fs.readdirSync(path.join(__dirname, 'api'));
    apis.forEach(async (api) => {
        if (api.endsWith('.js')) {
            const filePath = path.join(__dirname, 'api', api);
            const { default: routers } = await import(`file://${filePath}`);
            Object.values(routers).forEach((router) => {
                app.use('/api', router);
            });
        }
    });
}

await importAllApis();

app.post('/api/getUsernameFromToken', (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.decode(token, JWT_KEY);
        const username = decoded.username;

        console.log(username)
        return res.json({ username });
    } catch (error) {
        return res.json({ error: "Failed to get username from token" });
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
// await createDummyUsers();