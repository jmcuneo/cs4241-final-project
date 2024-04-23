/* eslint-disable no-undef */

import dotenv from 'dotenv';
import express, { json } from 'express';
import mongoose from 'mongoose';
import ViteExpress from 'vite-express';
import { testDB, createDummyUsers } from './dbTester.js';
import jwt from 'jsonwebtoken';

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

app.use(session({
    secret: '5O$5HP^xg2zV0duE',     //MAKE A NEW KEY EVENTUALLY AND MOVE TO .ENV
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
  }));


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

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

function generateToken(user){
    const payload = {
        username: user.username,
    };

    return jwt.sign(payload, "9s68zYkVaXeZ@aSnpc42CKY%%aWXrJp$$mFeWKE!!", { expiresIn: '1h' });     //MAKE A NEW KEY EVENTUALLY AND MOVE TO .ENV
}

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