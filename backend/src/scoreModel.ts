const mongoose = require("mongoose");
const scoreSchema = mongoose.Schema({
        // Score {
        //     Username: string,
        //     Score: number,
        //     Timestamp: timestamp,
        //     Game: string, the game the score is for
        // }

        // user_id: {
        //     //type: mongoose.Schema.Types.ObjectId,
        //     type: Number,
        //     required: true,
        //     default: 123,
        //     ref: "User",
        // },
        username: {
            type: String,
            required: true,
            ref: "User"
        },
        score: {
            type: Number,
            required: [true, "Please add the user score"],
        },
        game: {
            type: String,
            required: [true, "Please add the user game"]
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Score", scoreSchema);