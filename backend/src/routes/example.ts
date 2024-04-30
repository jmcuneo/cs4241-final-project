import express, { Router, Request, Response } from "express";
import {employeeFeedback} from "common/src/types";

const router: Router = express.Router();

let database: employeeFeedback[] = [];

//get all

router.post("/", async function (req: Request, res: Response) {
    const test: employeeFeedback = req.body;
    database.push(test);
    console.log("sakldjg;aslkjdfsdklmvkadjfldkmcz");
    res.status(200).json("added db object");
});

router.get("/", async function (req: Request, res: Response) {
    res.status(200).json(database);
});

router.get("/login-info", async function (req: Request, res: Response) {
    res.status(200).json("login-info");
})

export default router;
