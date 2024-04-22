/* eslint-disable no-undef */

import dotenv from 'dotenv';
import express, { json } from 'express';
import mongoose from 'mongoose';
import ViteExpress from 'vite-express';
import { testDB, createDummyUsers } from './dbTester.js';

import Account from './models/account.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import bodyParser from 'body-parser';
import passport from './passport.js';
import cors from 'cors';
import User from './models/user.js';

const app = express();
const port = 3000;

app.use(json());
dotenv.config();

//Account code
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session Middleware
app.use(session({
    secret: '5O$5HP^xg2zV0duE',
    resave: false,
    saveUninitialized: false,
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

/*
//auth middlware
const isAuth = (req, res, next)=>{
    if(req.session.isLoggedIn)
    next()
    else
        res.redirect('/login')
}

// Protected authentication check route
app.get('/', isAuth, (req, res) => {
});*/

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
    res.json({ success: true, message: "Login successful" });
});

// Connect to the database
connectToDB().catch(err => console.log(err));

/*
#################################################
WILL DELETE ENTIRE DB ON EVERY LOAD!!!!!!!!!!!!!!
Only keep when in DEVELOPMENT. 
#################################################
*/
// testDB();
await createDummyUsers();

/**
 * @description Connects to the MongoDB database using USER, PASS, and HOST in the .env file
 */
async function connectToDB() {
    const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
    await mongoose.connect(uri, { dbName: process.env.DBNAME });
}

// Random todo: Obfusicate ACCOUNT_TYPE.ADMIN? Would only take a couple sends to do and would
// make the application much more secure, especially considering it will be open source


ViteExpress.listen(app, process.env.PORT || port, () => {
    console.log("Server listening on port " + (process.env.PORT ? process.env.PORT : port));
});