import { io } from "socket.io-client";

// Assuming the frontend and backend are served from the same domain
const socket = io("/", {
  path: "/api/socket.io/"
});

export { socket };
