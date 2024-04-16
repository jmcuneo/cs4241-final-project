import express from 'express';
import vite from 'vite-express';
import {Server} from 'socket.io';

//import database from './database.js';
//import path from 'path';

//console.log('path: '+path.resolve())

const
  app = express(),
  port = 3000;


const server = vite.listen(app, process.env.PORT || port)

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect',()=>{
    console.log("user disconnected");
  });
  socket.on('chat message',(msg)=>{
    console.log("Message: " + msg);
  });
});