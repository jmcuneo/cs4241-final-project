import express, { Router, Request, Response } from "express";
import {employeeFeedback} from "common/src/types";
const Score = require("../scoreModel")
const router: Router = express.Router();


//@desc Get all user scores
//@ route GET /
//@access private
router.get("/", async function (req: Request, res: Response) {
    const scores = await Score.find();
    res.status(200).json(scores);
});

//@desc Create new user score
//@ route POST /
//@access private
router.post("/", async function (req: Request, res: Response) {
    console.log("Body")
    console.log(req.body)
    const{username, score, game} = req.body
    if(!username || !score || !game){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const points = await Score.create({
        username, score, game,
    });
    //res.status(200).json(recipe);
    console.log(points)
    res.status(200).json(points);
    //return points;
});

//@desc Get particular user score
//@ route GET /:id
//@access private
router.get("/:id", async function (req: Request, res: Response) {
    console.log("Hello");
    const user = await Score.findById(`${req.body.username}`);
    //const recipe = await Recipe.find({user_id:123});
    if(!user){
        res.status(404);
        throw new Error("User Not Found");
    }
    console.log("User: "+user);
    res.status(200).json(user);
    //return scores;
});

export default router;
