import {io} from "socket.io-client";

const socketgen = io("ws://localhost:3000", {
	path: "/api/socket.io/"
});

export const socket = socketgen;
