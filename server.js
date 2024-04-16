import express from 'express';
import vite from 'vite-express';
import { createServer } from 'node:http';
import {Server} from 'socket.io';

//import database from './database.js';
//import path from 'path';

//console.log('path: '+path.resolve())

const
  app = express(),
  port = 3000,
  server = createServer(app),
  io = new Server(server);

server.listen(5000,()=>{
  console.log("listening on 5000")
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

vite.listen(app, process.env.PORT || port)
