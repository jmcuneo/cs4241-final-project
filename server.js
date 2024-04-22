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

io.on('connection', (socket) => {
  console.log('a user connected');
  function sendServerChatMessage(room,message){
    //TODO: Append to chat history.
    database.pushGame(room,'chat',{"author":"Server","msg":message});
    io.to(room).emit('message receive',"Server",message);
  }
  socket.on('host game', async (room)=>{
    room = room.toLowerCase();
    const existingGame = await database.getGameByRoomCode(room);
    if(existingGame != null){
      socket.emit('host failed','room in use');
    }else{
      const game = await database.createNewGame(room,"pokemon");
      await database.updateGame(room,"p1",{name:"Player 1",id:socket.id});

      socket.join(room);
      socket.emit('host success',room,"Player 1");
      //TODO: Emit start game event to first player
      sendServerChatMessage(room,"Player 1 joined the game.");
      //TODO: Also send flipped and guessed
      socket.emit('game setup',game.board,game.answer_p1,game.flipped_p1,game.guessed_p1,game.chat);
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
          socket.emit('game setup',game.board,game.answer_p2,game.flipped_p2,game.guessed_p2,game.chat);
        }else if(game.p1==null){
          // rooms[room].p1 = {name:"Player 1",id:socket.id};
          await database.updateGame(room,"p1",{name:"Player 1",id:socket.id});
          socket.join(room);
          socket.emit('join success',room,"Player 1");
          sendServerChatMessage(room,"Player 1 joined.");
          socket.emit('game setup',game.board,game.answer_p1,game.flipped_p1,game.guessed_p1,game.chat);
        }
      }
    }else{
      socket.emit('join failed','room not found');
    }
  });
  socket.on('chat message',(room,name,msg)=>{
    //TODO: Append to chat history
    database.pushGame(room,'chat',{"author":name,"msg":msg});
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
        database.updateGame(room,"guessed_p1."+index,true);
      }else{
        //p2
        answer = game.answer_p1;
        otherAnswer = game.answer_p2;
        winner = game.p2.name;
        database.updateGame(room,"guessed_p2."+index,true);
      }
      console.log("Guess: " + index + ", Answer: " + answer);
      if(index==answer){
        socket.broadcast.to(room).emit('game end',winner,otherAnswer);
        socket.emit('game end',winner,answer);
      }
    }
  });
  socket.on('flip',async function(room,name,index,cardName){
    //TODO: Add to flipped obj
    //TODO: Change to send server message function
    const game = await database.getGameByRoomCode(room);
    let flippedArr = game.p1.name==name?"flipped_p1":"flipped_p2"
    await database.updateGame(room,flippedArr+"."+index,!flippedArr[index]);
    sendServerChatMessage(room,name + " flipped " + cardName);
  });
  socket.on('complete game left',async function(room,name){
    sendServerChatMessage(room,name + " left.");
    socket.leave(room);
    const game = await database.getGameByRoomCode(room);
    if(name==game.p1.name){
      await database.updateGame(room,"p1",null);
      await checkForDelete(game,room,game.p2);
    }else{
      await database.updateGame(room,"p2",null);
      await checkForDelete(game,room,game.p1);
    }
  });
  socket.on('disconnecting',async function(reason){
    console.log("Disconnecting fired");
    for(const room of socket.rooms){
      const game = await database.getGameByRoomCode(room);
      if(game != null){
        console.log(game.p1,game.p2,socket.id);
        if(game.p1 != null && game.p1.id==socket.id){
          console.log("p1 disconnected");
          // io.to(room).emit('message receive',"Server",rooms[room].p1.name + " disconnected.");
          sendServerChatMessage(room,game.p1.name + " disconnected.");
          await database.updateGame(room,"p1",null);
          await checkForDelete(game,room,game.p2);
        }
        if(game.p2 != null && game.p2.id==socket.id){
          console.log("p2 disconnected");
          // io.to(room).emit('message receive',"Server",rooms[room].p2.name + " disconnected.");
          sendServerChatMessage(room,game.p2.name + " disconnected.");
          await database.updateGame(room,"p2",null);
          await checkForDelete(game,room,game.p1);
        }
        break;
      }
    }
  });
  socket.on('disconnect',()=>{
    //TODO: Handle disconnect
    //socket.rooms.forEach will iterate through rooms they've joined
    console.log("user disconnected");
  });
});

async function checkForDelete(game, room, otherPlayer){
  if(otherPlayer === null){
    // both players disconnected, delete game from database
    // TODO: disconnect after timer is up
    console.log("Deleting game");
    await database.deleteGame(room);
  }
}


database.set_up_db_store(app)