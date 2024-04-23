import express from "express";
import dotenv from "dotenv";

const app =  express();
dotenv.config();

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => { 
    //root route
    res.send("server is ready");
});

app.listen(PORT, () => console.log( `server running on port ${PORT}`));

