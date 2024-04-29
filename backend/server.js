import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/auth.routes.js"; 
//import messageRoutes from "./routes/message.routes.js"; 
import userRoutes from "./routes/user.routes.js";

import socketioConnection from "./controllers/socketio.controller.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

const PORT = process.env.PORT || 8000;
const app =  express();
const io = new Server(app.listen(3636), {
	path: "/api/socket.io/"
});
app.set("io", io);

dotenv.config();

app.use(express.json()); //parse json data in the request body (from req.body)
app.use(cookieParser()); //parse cookies from the request headers

app.use("/api/auth", authRoutes);
//app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.get("/", (req, res) => { 
//     //root route
//     res.send("server is ready");
// });



app.listen(PORT, () => {
  connectToMongoDB();
  console.log( `server running on port ${PORT}`);
	socketioConnection(io);
});

