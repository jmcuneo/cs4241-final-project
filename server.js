/* eslint-disable no-undef */

import dotenv from 'dotenv';
import express, { json } from 'express';
import mongoose from 'mongoose';
import ViteExpress from 'vite-express';
import { testDB } from './dbTester.js';

const app = express();
const port = 3000;

app.use(json());
dotenv.config();

// Connect to the database
connectToDB().catch(err => console.log(err));

/*
#################################################
WILL DELETE ENTIRE DB ON EVERY LOAD!!!!!!!!!!!!!!
Only keep when in DEVELOPMENT. 
#################################################
*/
testDB();

/**
 * @description Connects to the MongoDB database using USER, PASS, and HOST in the .env file
 */
async function connectToDB() {
    const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
    await mongoose.connect(uri, { dbName: process.env.DBNAME });
}

// Random todo: Obfusicate ACCOUNT_TYPE.ADMIN? Would only take a couple sends to do and would
// make the application much more secure, especially considering it will be open source

// Also, Account model? Can use that to make password view-only on user, making it more secure

ViteExpress.listen(app, process.env.PORT || port, () => {
    console.log("Server listening on port " + (process.env.PORT ? process.env.PORT : port));
});