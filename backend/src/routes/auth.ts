import express, {Router, Request, Response, response} from "express";
import passport from 'passport';
const router: Router = express.Router();
import cors from 'cors';
//const fetch = (...args:any[]) => import('node-fetch').then(({default: fetch}) => fetch(...args));
import fetch from 'node-fetch'
// import { RequestInfo, RequestInit } from 'node-fetch';
// const fetch = (url:RequestInfo, init?:RequestInit) => import('node-fetch').then(module => module.default(url, init));
import bodyParser from 'body-parser';

const CLIENT_ID = "f0bb48553c39a2d19844";
const CLIENT_SECRET = "a8718689d2ebfedf377ccc7f86776540f0a778a2";

router.get("/getAccessToken", async (req, res) => {
    req.query.code;

    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;
    await fetch("https://github.com/login/oauth/access_token"+params, {
        method: "POST",
        headers:{
            "Accept": "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log("get access token: ")
        console.log(data)
        res.json(data);
    })
})


router.get("/getUserData", async (req, res) => {
    const authorization = req.get("Authorization"); //Bearer AccessToken
    console.log(authorization);

    if (authorization) {
        try {
            const response = await fetch("https://api.github.com/user", {
                method: "GET",
                headers: {
                    "Authorization": authorization,
                },
            });

            if (!response.ok) {

                return res.status(response.status).send("Error fetching user data");
            }

            const userData = await response.json();
            console.log("User data:", userData);
            res.json(userData);
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.status(500).send("Internal server error");
        }
    } else {
        res.status(401).send("Not authorized");
    }
});



export default router;