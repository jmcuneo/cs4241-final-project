/* eslint-disable no-undef */

import express, { json } from 'express';
import ViteExpress from 'vite-express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

app.use(json());
dotenv.config();

// Connect to the database
connectToDB().catch(err => console.log(err));

/**
 * @author @AlexanderBeck0
 * @description Connects to the MongoDB database using USER, PASS, and HOST in the .env file
 */
async function connectToDB() {
    const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
    await mongoose.connect(uri);
}

ViteExpress.listen(app, process.env.PORT || port, () => {
    console.log("Server listening on port " + (process.env.PORT ? process.env.PORT : port));
});