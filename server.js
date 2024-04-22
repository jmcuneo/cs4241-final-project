/* eslint-disable no-undef */

import dotenv from 'dotenv';
import express, { json } from 'express';
import mongoose from 'mongoose';
import ViteExpress from 'vite-express';
import { testDB } from './dbTester.js';

import Account from './models/account.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import bodyParser from 'body-parser';
import passport from './passport.js';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
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
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

app.use(session({
  secret: '5O$5HP^xg2zV0duE',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise: client.connect()
  })
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Register Route
app.post('/register', async (req, res) => {
    try {
      const newAccount = await Account.create({
        username: req.body.username,
        password: req.body.password
      });
      // Check for existing username
      const existingUser = await Account.findOne({ username: req.body.username });
      if (!existingUser) {
        return res.status(409).json({ success: false, message: "Username already exists" });
      }
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
app.post('/login', async (req, res) => {
    try {
      //let accountCollection = await client.db(process.env.DBNAME).collection("accounts");
  
      // Check for existing username
      const existingUser = await Account.findOne({ username: req.body.username }).select('username +password password').exec();
      //console.log("existingUser: " + existingUser);
      if (existingUser) {
        const isPasswordMatch = await bcrypt.compare(req.body.password, existingUser.password);
        if(isPasswordMatch) {
          // Set session variable to indicate user is logged in
          req.session.isLoggedIn = true;
          passport.authenticate('local')(req, res, function() {
            res.json({ success: true, message: "Login successful" });
          });
        }
        else { // Incorrect password
          res.status(401).json({ success: false, message: 'Incorrect password' });
        }
      }
      else { // Username not found
        res.status(401).json({ success: false, message: 'Username not found' });
      }
    } catch (error) {
      console.error("Login error:", error); // Detailed error 
      res.status(500).json({ success: false, message: "Login error" });
    }
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