import express from 'express';
import User from '../models/user.js';
import { getUsernameFromToken, hideFieldsFromObject, renameFieldInObject } from '../server.js';
const router = express.Router();

router.post('/getProfile', async (req, res) => {
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

export default { router };