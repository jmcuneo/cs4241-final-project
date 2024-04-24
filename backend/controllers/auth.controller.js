
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
export const signup = async (req, res) => {

    try {
        const { fullName, username, password, confirmPassword } = req.body;

        if (password != confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" })
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Username already exists" })
        }

        //Hash Password Here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //https://ui-avatars.com/avatar-placeholder/


        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            profilePic: `https://ui-avatars.com/api/?name=${username}+${username}&background=0D8ABC`
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            //generate jwt token

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ error: "invalid user data" });
        }

    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({ error: "internal Server Error" });
    }
}

export const login = (req, res) => {
    console.log("login user");
    res.send("login user");
}

export const logout = (req, res) => {
    console.log("logout user");
    res.send("logout user");
}
