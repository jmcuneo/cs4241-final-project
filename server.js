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
      }else{
        socket.emit('guess failed');
      }
    }
  });
  socket.on('flip',async function(room,name,index,cardName){
    //TODO: Add to flipped obj
    //TODO: Change to send server message function
    const game = await database.getGameByRoomCode(room);
    let flippedArr = game.p1.name==name?"flipped_p1":"flipped_p2";
    // console.log(game[flippedArr][index]);
    await database.updateGame(room,flippedArr+"."+index,!game[flippedArr][index]);
    sendServerChatMessage(room,name + " flipped " + cardName);
  });
  socket.on('complete game left',async function(room,name){
    sendServerChatMessage(room,name + " left.");
    socket.leave(room);
    const game = await database.getGameByRoomCode(room);
    if(game.p1 != null && name==game.p1.name){
      await database.updateGame(room,"p1",null);
      await database.updateGame(room,"playAgain_p1",false);
      await checkForDelete(game,room,game.p2);
    }else if(game.p2 != null){
      await database.updateGame(room,"p2",null);
      await database.updateGame(room,"playAgain_p2",false);
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
          await database.updateGame(room,"playAgain_p1",false);
          if(game.p2 != null){
            socket.to(game.p2.id).emit('play again deselected');
          }
          await checkForDelete(game,room,game.p2);
        }
        if(game.p2 != null && game.p2.id==socket.id){
          console.log("p2 disconnected");
          // io.to(room).emit('message receive',"Server",rooms[room].p2.name + " disconnected.");
          sendServerChatMessage(room,game.p2.name + " disconnected.");
          await database.updateGame(room,"p2",null);
          await database.updateGame(room,"playAgain_p2",false);
          if(game.p1 != null){
            socket.to(game.p1.id).emit('play again deselected');
          }
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
  socket.on('play again',async function(room,name){
    const game = await database.getGameByRoomCode(room);
    let startNewGame = false;
    let isPlayer1 = false;
    //TODO: Set these back to false if someone leaves.
    //Set text to x/2 where x is the number of players who have selected it.
    if(game!=null && game.p1 != null && game.p2 != null){
      if(game.p1.name=="Player 1"){
        isPlayer1=true;
        database.updateGame(game,"playAgain_p1",true);
        if(game.playAgain_p2){
          startNewGame=true;
        }
        socket.to(game.p2.id).emit('play again selected');
      }else{
        database.updateGame(game,"playAgain_p2",true);
        if(game.playAgain_p1){
          startNewGame=true;
        }
        socket.to(game.p1.id).emit('play again selected');
      }
    }
    if(startNewGame){
      await database.deleteGame(room);
      const newGame = await database.createNewGame(room,"pokemon");
      await database.updateGame(room,"p1",{name:"Player 1",id:game.p1.id});
      await database.updateGame(room,"p2",{name:"Player 2",id:game.p2.id});
      socket.emit('host success',room,"Player 1");
      sendServerChatMessage(room,"Player 1 joined the game.");
      io.to(game.p1.id).emit('host success',room,"Player 1");
      io.to(game.p2.id).emit('join success',room,"Player 2");
      io.to(game.p1.id).emit('game setup',newGame.board,newGame.answer_p1,newGame.flipped_p1,newGame.guessed_p1,newGame.chat);
      io.to(game.p2.id).emit('game setup',newGame.board,newGame.answer_p1,newGame.flipped_p1,newGame.guessed_p1,newGame.chat)
    }
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