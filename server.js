import express from 'express';
import vite from 'vite-express';
import {Server} from 'socket.io';

import database from './database.js';
//import path from 'path';

//console.log('path: '+path.resolve())

const
  app = express(),
  port = 3000;


const server = vite.listen(app, process.env.PORT || port)

const io = new Server(server);

const rooms = {};

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect',()=>{
    //TODO: Handle disconnect
    //socket.rooms.forEach will iterate through rooms they've joined
    console.log("user disconnected");
  });
  socket.on('chat message',(msg)=>{
    console.log("Message: " + msg);
    socket.emit('host failed','room full');
  });
  socket.on('host game',(room)=>{
    room = room.toLowerCase();
    if(room in rooms){
      if(rooms[room]>=2){
        socket.emit('host failed','room full');
      }else{
        socket.emit('host failed','room in use');
      }
    }else{
      rooms[room] = 1;
      socket.join(room);
      socket.emit('host success',room,1);
    }
  });
  socket.on('join game',(room)=>{
    room = room.toLowerCase();
    if(room in rooms){
      if(rooms[room] >= 2){
        socket.emit('join failed','room full');
      }else{
        rooms[room]+=1;
        socket.join(room);
        socket.emit('join success',room,2)
      }
    }else{
      socket.emit('join failed','room not found');
    }
  });
  socket.on('chat message',(room,num,msg)=>{
    io.to(room).emit('message receive',num,msg);
  });
});


database.set_up_db_store(app)