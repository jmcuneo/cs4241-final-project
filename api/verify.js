import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import User, { ACCOUNT_TYPE } from '../models/user.js';
import { JWT_KEY } from '../server.js';
dotenv.config();

const router = express.Router();

router.post('/verifyToken', (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            // If token is null
            // Prevent jwt.verify throwing an error and cluttering the console
            // This can be removed if the console.log is removed from the catch
            return res.json({ valid: false });
        }
        const decoded = jwt.verify(token, JWT_KEY);
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

router.post('/verifyAdmin', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            // If token is null
            // Prevent jwt.verify throwing an error and cluttering the console
            // This can be removed if the console.log is removed from the catch
            return res.json({ valid: false });
        }
        const decoded = jwt.verify(token, JWT_KEY);

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

export default { router }