import express from 'express';
import vite from 'vite-express';
import {Server} from 'socket.io';

import database from './database.js';
//import path from 'path';

//console.log('path: '+path.resolve())

const
  app = express(),
  port = 3000;

app.use(express.json());

const server = vite.listen(app, process.env.PORT || port)

const io = new Server(server);


function randomAnswer(){
  return Math.floor(Math.random()*24);
}

io.on('connection', (socket) => {
  console.log('a user connected');
  function sendServerChatMessage(room,message){
    //TODO: Append to chat history.
    io.to(room).emit('message receive',"Server",message);
  }
  socket.on('disconnect',()=>{
    //TODO: Handle disconnect
    //socket.rooms.forEach will iterate through rooms they've joined
    console.log("user disconnected");
  });
  socket.on('chat message',(msg)=>{
    console.log("Message: " + msg);
    socket.emit('host failed','room full');
  });
  socket.on('host game', async (room)=>{
    room = room.toLowerCase();
    const existingGame = await database.getGameByRoomCode(room);
    if(existingGame != null){
      socket.emit('host failed','room in use');
    }else{
      //TODO: Use the DB and populate the list
      console.log("Message: ", room);

      const game = await database.createNewGame(room,"pokemon");

      socket.join(room);
      socket.emit('host success',room,"Player 1");
      //TODO: Emit start game event to first player
      sendServerChatMessage(room,"Player 1 joined the game.");
      //TODO: Also send flipped and guessed
      socket.emit('game setup',game.board,game.answer_p1);
    }
  });
  
  socket.on('join game',async function(room){
    room = room.toLowerCase();
    let game = await database.getGameByRoomCode(room);
    if(game != null){
      if(game.p1 != null && game.p2 != null){
        socket.emit('join failed','room full');
      }else{
        if(game.p2==null){
          // game.p2 = {name:"Player 2",id:socket.id};
          await database.updateGame(room,"p2",{name:"Player 2",id:socket.id});
          socket.join(room);
          socket.emit('join success',room,"Player 2");
          sendServerChatMessage(room,"Player 2 joined.");
          socket.emit('game setup',game.board,game.answer_p2);
        }else if(game.p1==null){
          // rooms[room].p1 = {name:"Player 1",id:socket.id};
          await database.updateGame(room,"p1",{name:"Player 1",id:socket.id});
          socket.join(room);
          socket.emit('join success',room,"Player 1");
          sendServerChatMessage(room,"Player 1 joined.");
          socket.emit('game setup',game.board,game.answer_p1);
        }
      }
    }else{
      socket.emit('join failed','room not found');
    }
  });
  socket.on('chat message',(room,name,msg)=>{
    //TODO: Append to chat history
    io.to(room).emit('message receive',name,msg);
  });
  socket.on('guess',async function(room,name,index,cardName){
    const game = await database.getGameByRoomCode(room);
    //TODO: Prevent click if there are <2 players connected.
    if(game != null && game.p1 != null && game.p2 != null){
      sendServerChatMessage(room,name + " guessed " + cardName);
      let answer;
      let otherAnswer;
      let winner;
      let isPlayer1 = game.p1.name == name;
      if(isPlayer1){
        //p1
        answer = game.answer_p2;
        otherAnswer = game.answer_p1;
        winner = game.p1.name;
      }else{
        //p2
        answer = game.answer_p1;
        otherAnswer = game.answer_p2;
        winner = game.p2.name;
      }
      console.log("Guess: " + index + ", Answer: " + answer);
      if(index==answer){
        socket.broadcast.to(room).emit('game end',winner,otherAnswer);
        socket.emit('game end',winner,answer);
      }
    }
  });
  socket.on('flip',(room,name,index,cardName)=>{
    //TODO: Add to flipped obj
    //TODO: Change to send server message function
    sendServerChatMessage(room,name + " flipped " + cardName);
  });
  socket.on('complete game left',(room,name)=>{
    sendServerChatMessage(room,name + " left.");
    socket.leave(room);
  });
  socket.on('disconnecting',async function(reason){
    for(const room of socket.rooms){
      // console.log(room);
      const game = await database.getGameByRoomCode(room);
      if(game != null){
        if(game.p1 != null && game.p1.id==socket.id){
          // console.log("p1 disconnected");
          // io.to(room).emit('message receive',"Server",rooms[room].p1.name + " disconnected.");
          sendServerChatMessage(game.p1.name + " disconnected.");
          game.p1=null;
        }
        if(game.p2 != null && game.p2.id==socket.id){
          // console.log("p2 disconnected");
          // io.to(room).emit('message receive',"Server",rooms[room].p2.name + " disconnected.");
          sendServerChatMessage(game.p2.name + " disconnected.");
          game.p2=null;
        }
        break;
      }
    }
  });
});


database.set_up_db_store(app)