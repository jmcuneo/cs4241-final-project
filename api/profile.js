import express from 'express';
import User, { ACCOUNT_TYPE, PERMISSIONS } from '../models/user.js';
import { getUsernameFromToken, hideFieldsFromObject, renameFieldInObject } from '../server.js';
const router = express.Router();

router.post('/getProfile', async (req, res) => {
    try {
        const { token } = req.body;
        const username = getUsernameFromToken(token);
        const profile = await User.findOne({ username: username }).select('fullName username accountType prettyAccountType').populate('firstName lastName').exec();

        return res.json(hideFieldsFromObject(
            renameFieldInObject(hideFieldsFromObject(profile.toObject(), 'accountType'),
                'prettyAccountType', 'accountType'),
            'id', '_id'));
    } catch (err) {
        console.log(err);
        return res.json({ error: "Failed to authenticate token" });
    }
});

router.post('/makeAdmin', async (req, res) => {
    try {
        const { token, targetUser } = req.body;
        const username = getUsernameFromToken(token);
        const user = await User.findOne({ username: username });

        if (user.accountType !== ACCOUNT_TYPE.ADMIN && !user.permissions.includes(PERMISSIONS.GIFT_ADMIN)) {
            return res.json({ success: false, error: "Non-admin account tried to make someone admin" });
        }

        const newAdmin = await User.findOne({ username: targetUser });
        if (!newAdmin || newAdmin === null || newAdmin === undefined) {
            return res.json({ success: false, error: "User not found" });
        }

        const success = await user.makeAdmin(newAdmin);

        return res.json({ success: success, error: "none" });
    } catch (err) {
        console.log(err);
        return res.json({ error: "Failed to make admin" });
    }
});

export default { router };