const express = require("express"),
      axios = require("axios"),
      path = require("path"),
      session = require("express-session"),
      { MongoClient, ObjectId } = require("mongodb"),
      socketIO = require('socket.io'),
      dotenv = require('dotenv').config({ path: "./.env" }),
      http = require('http'),
      app = express()

app.use( express.static('public') )
app.use( express.json() )

const server = http.createServer( app )

var io = socketIO(server);

// make connection with user from server side
io.on('connection', (socket) => {
    console.log('New user connected');
    //emit message from server to user
    socket.emit('newMessage',
        {
            from: 'jen@mds',
            text: 'hepppp',
            createdAt: 123
        });

    // listen for message from user
    socket.on('createMessage',
        (newMessage) => {
            console.log('newMessage', newMessage);
        });

    // when server disconnects from user
    socket.on('disconnect',
        () => {
            console.log('disconnected from user');
        });
});
 
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

server.listen( 3000 )