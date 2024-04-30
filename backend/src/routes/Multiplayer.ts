import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

//get all

router.post("/", async function (req: Request, res: Response) {
    res.status(200).json("added db object");
});

router.get("/", async function (req: Request, res: Response) {

});

router.get("/login-info", async function (req: Request, res: Response) {
    res.status(200).json("login-info");
})

export default router;
