import express from "express";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

const socketioConnection = async (io) => {

	io.on("connection", (socket) => {
		console.log("connection!");
		let cookiestring = socket.handshake.headers.cookie;
		let cookies = cookie.parse(cookiestring);
		const decoded = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
		console.log(decoded.userId);
		socket.join(decoded.userId);
		socket.on("sendMessage", (message) => {
			console.log(message);
		});
	});
};

export default socketioConnection;
