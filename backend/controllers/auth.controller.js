
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {

    try {
        const { fullName, username, password, confirmPassword } = req.body;

				const lowerUsername = username.toLowerCase();

        if (password != confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" })
        }

        const user = await User.findOne({ username: lowerUsername });

        if (user) {
            return res.status(400).json({ error: "Username already exists" })
        }

        //Hash Password Here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const generateRandomColor = () => {
            return '#' + Math.floor(Math.random()*16777215).toString(16);
        }

        // Generate a random color for profile picture
        const profileColor = generateRandomColor();


        const newUser = new User({
            fullName,
            username: lowerUsername,
            password: hashedPassword,
            profilePic: profileColor  
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

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
				const lowerUsername = username.toLowerCase();
				console.log(lowerUsername);
        const user = await User.findOne({username: lowerUsername});
        const isPasswordCorrect = user && await bcrypt.compare(password, user?.password || "");
        


        if (!user) {
            return res.status(400).json({ error: "Username Does Not Exist" })
        }

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid Username or Password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });
        
    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({ error: "internal Server Error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "",{ maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({ error: "internal Server Error" });
    }
}

