import Conversation from "../models/conversation.model.js";
import Message from  "../models/message.model.js";
import User from "../models/user.model.js";
import { Server } from "socket.io";

const socketioHandleMessages = async (socket, io) => {
	socket.on("sendMessage", async (message) => {
		const senderId = socket.decodedUID

		if (!message.hasOwnProperty("msg") || !message.hasOwnProperty("to")) {
			console.log("invalid message!");
			return;
		}
		const toId = message.to;
		const msg = message.msg

		const user = await User.findById(socket.decodedUID).select("-password");
		const toUser = await User.findById(message.to).select("-password");

		if(!user || !toUser) {
			console.log("invalid sender or recipient");
		}
	
		console.log(user + " " + toUser);
		
		let conversation = await Conversation.findOne({
			participants: {
				$all: [senderId, toId] 
			}
		})

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, toId]
			})
		}
		const newMessage = new Message({
			senderId,
			toId,
			msg
		})

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		io.to(socket.decodedUID).to(toId).emit("message", newMessage);
	
	})
}

export default socketioHandleMessages;

