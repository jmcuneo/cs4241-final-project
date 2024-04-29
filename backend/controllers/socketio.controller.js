import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import socketioHandleMessages from "./message.controller.js";

const socketioConnection = async (io) => {

	io.on("connection", (socket) => {
		console.log("connection!");
		let cookiestring = socket.handshake.headers.cookie;
		let cookies = cookie.parse(cookiestring);
		const decoded = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
		console.log(decoded.userId);
		socket.join(decoded.userId);
		socket.decodedUID = decoded.userId;
		socketioHandleMessages(socket, io);
		socket.on("sendMessage", (message) => {
			console.log(message);
		});
	});
};

export default socketioConnection;
