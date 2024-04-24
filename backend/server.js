import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"; 
import { connect } from "mongoose";
import connectToMongoDB from "./db/connectToMongoDB.js";
const PORT = process.env.PORT || 8000;
const app =  express();

dotenv.config();

app.use(express.json()); //parse json data in the request body (from req.body)

app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => { 
//     //root route
//     res.send("server is ready");
// });



app.listen(PORT, () => {
    connectToMongoDB();
    console.log( `server running on port ${PORT}`)
});

