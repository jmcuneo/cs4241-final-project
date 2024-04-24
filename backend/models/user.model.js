import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },

    username:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true,
        minLength: 6,
    },

    profilePic:{
        type: String,
        default: "",
    }
});

const User = mongoose.model("User", userSchema); //create a model from the schema

export default User;