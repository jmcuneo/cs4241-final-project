import { io } from "socket.io-client"

// const socket = io('localhost:8080')
const socket = io('cs4241-chess.onrender.com', { transports: ['websocket'] }) // TODO: this might not let things work across computers

export default socket