const express = require("express"),
      axios = require("axios"),
      path = require("path"),
      session = require("express-session"),
      { MongoClient, ObjectId } = require("mongodb"),
      socketIO = require('socket.io'),
      dotenv = require('dotenv').config({ path: "./.env" }),
      http = require('http'),
      app = express(),
      clientID = process.env.GITHUB_ID,
      clientSecret = process.env.GITHUB_SECRET;

app.use( express.static('public') )
app.use( express.json() )
app.use(session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
    })
);

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

app.get("/auth/github/login", (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${clientID}`
    );
  });

  app.get("/auth/github/callback", async (req, res) => {
    const requestToken = req.query.code;
    const response = await axios.post(
      `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
      {},
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    access_token = response.data.access_token;

    req.session.accessToken = access_token;

    res.redirect("/success");
  });

  app.get("/success", async (req, res) => {
    if (!req.session.accessToken) {
      res.redirect("/auth/github/login");
      return;
    }

    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${req.session.accessToken}`,
      },
    });
    const userData = response.data;
    user = userData.name;

    res.sendFile(path.join(__dirname, "public", "home.html"));
  });

server.listen( 3000 )