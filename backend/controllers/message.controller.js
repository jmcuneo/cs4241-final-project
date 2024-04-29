import Conversation from "../models/conversation.model.js";
import Message from  "../models/message.model.js";
import User from "../models/user.model.js";
import { Server } from "socket.io";

const socketioHandleMessages = async (socket, io) => {
	socket.on("sendMessage", async (messagesio) => {
		const senderId = socket.decodedUID;

		if (!messagesio.hasOwnProperty("msg") || !messagesio.hasOwnProperty("to")) {
			console.log("invalid message!");
			return;
		}
		const recieverId = messagesio.to;
		const message = messagesio.msg

		const user = await User.findById(senderId).select("-password");
		const toUser = await User.findById(recieverId).select("-password");

		if(!user || !toUser) {
			console.log("invalid sender or recipient");
		}
	
		console.log(user + " " + toUser);
		
		let conversation = await Conversation.findOne({
			participants: {
				$all: [senderId, recieverId] 
			}
		})

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, recieverId]
			})
		}
		const newMessage = new Message({
			senderId,
			recieverId,
			message
		})
		
		await newMessage.save();
		await conversation.save();

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}
		console.log(user.fullName);
		io.to(senderId).to(recieverId).emit("message", newMessage, user.fullName);
	
	})

	socket.on("getMessages", async (message) => {
		let retJson = {};
		const senderId = socket.decodedUID
		let index;
		if (!message.hasOwnProperty("index")) {
			index = 0;
		}
		else index = message.index;
		if (!message.hasOwnProperty("to")) {
			return;
		}
		const recieverId = message.to;

		const conversation = await Conversation.findOne({
			participants: {
				$all: [recieverId, senderId]
			}
		}).populate("messages");

		if (!conversation) {
			io.to(senderId).emit("conversation", retJson);
			return;
		}
		io.to(senderId).emit("conversation", conversation.messages || []);
	})
}

export default socketioHandleMessages;

