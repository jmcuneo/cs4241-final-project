import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/auth.routes.js"; 
import messageRoutes from "./routes/message.routes.js"; 
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";

const PORT = process.env.PORT || 8000;
const app =  express();
const io = new Server(app.listen(3636));
app.set("socketio", io);

dotenv.config();

app.use(express.json()); //parse json data in the request body (from req.body)
app.use(cookieParser()); //parse cookies from the request headers

// temporary!

io.on("connection", (socket) => {
	console.log("connection!");
	let cookiestring = socket.handshake.headers.cookie;
	let cookies = cookie.parse(cookiestring);
	const decoded = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
	console.log(decoded.userId);
	console.log(socket.id);
	socket.join(decoded.userId);
	socket.on("sendMessage", (message) => {
		console.log(message);
	});
})

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.get("/", (req, res) => { 
//     //root route
//     res.send("server is ready");
// });



app.listen(PORT, () => {
    connectToMongoDB();
    console.log( `server running on port ${PORT}`)
});

