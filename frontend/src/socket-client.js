import {io} from "socket.io-client";

export const socket = io("ws://localhost:3000", {
	path: "/api/socket.io/"
});
