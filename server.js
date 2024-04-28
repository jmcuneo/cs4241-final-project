const express = require("express"),
    axios = require("axios"),
    path = require("path"),
    session = require("express-session"),
    { MongoClient, ServerApiVersion } = require("mongodb"),
    socketIO = require('socket.io'),
    dotenv = require('dotenv').config({ path: "./.env" }),
    http = require('http'),
    app = express(),
    clientID = process.env.GITHUB_ID,
    clientSecret = process.env.GITHUB_SECRET,
    { Server } = require("socket.io");

app.use(express.static('public'))
app.use(express.json())
app.use(session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
})
);

const dbPwd = "admin"

const uri = `mongodb+srv://admin:${dbPwd}@cluster0.wsalwot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


let userdata = []

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

const server = http.createServer(app)
const io = new Server(server);

let numberOfPlayer;
let startingHealth = 0;
let players = [];
let clients = [];
let gamestarted = false;
let loserQueue = [];
let gameCreated = false;
let postGameResults = "GG"
let gameID;

// make connection with user from server side
io.on('connection', (socket) => {
    console.log('New user connected');
    clients.push(socket)
    console.log(clients.length)

    if(gamestarted){
        socket.emit('gamestarted', players)
    }

    //emit message from server to user
    socket.emit('newMessage',
        {
            startingHealth: startingHealth,
            numberOfPlayer: numberOfPlayer
        });

    socket.on('join',
        (newMessage) => {
            players.push({
                username: newMessage.user,
                health: startingHealth,
                isAlive: true
            })
            console.log(newMessage)
            if (players.length == numberOfPlayer) {
                console.log("Number of players reached")
                gamestarted = true
                clients.forEach(c => { c.emit('maxPlayersReached', players) })
            }
        }
    )

    // when server disconnects from user
    socket.on('disconnect',
        () => {
            console.log('disconnected from user');
            console.log(clients.length)
        });

    socket.on('healthchange', (message) => {
        console.log(message)
        players.forEach(player => {
            if ((player.username == message.user) && (player.isAlive)) {
                player.health += message.healthChange
            }
        })
        console.log(players)
        clients.forEach( c => {c.emit('update', players ) })
    })

    socket.on('playerdeath', (message) => {
        console.log(message)
        players.forEach(player => {
            if (player.username == message.user) {
                player.isAlive = !player.isAlive
                if(!player.isAlive){
                    loserQueue.push(player)
                } else{
                    loserQueue.splice(loserQueue.indexOf(player), 1)
                }
                console.log(players)
                console.log("Losers:")
                console.log(loserQueue)
                if(loserQueue.length = numberOfPlayer-1){
                    console.log("Game Over")
                    gameOver()
                }
            }
        })
        clients.forEach( c => {c.emit('update', players ) })
    })

    socket.on('gameOver', (message) => {
        gameOver()
    })

});

async function gameOver(){
    console.log("Game Over")
    clients.forEach( c => {c.emit('gameOver', postGameResults ) })
    let temp = []
    players.forEach(player =>{
        if(player.isAlive){
            temp.push(player)
        }
    })
    temp.sort((a, b) => a.health - b.health)
    console.log(temp)
    temp.forEach(player =>{
        loserQueue.push(player)
    })
    console.log("Current Losers Queue:")
    console.log(loserQueue)
    const winners = []
    loserQueue.forEach(player =>{
        winners.push(player.username)
    })
    winners.reverse()
    console.log(winners)
    console.log(gameID)
    await concludeGame(gameID, winners)
    
}

app.post("/createGame", (req, res) => {
    createGame()
    numberOfPlayer = req.body.players
    startingHealth = parseInt(req.body.health)
    gameCreated = true;
    console.log(`Created Game: \n Number of Players: ${numberOfPlayer} \n Starting Heath: ${startingHealth}`)
    res.sendStatus(200)
})

app.get("/isGameCreated", async (req, res) => {
    console.log(gameCreated)
    res.json({ gameStatus: gameCreated });
})

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
    const data = response.data;
    userdata.push({ username: data.login, name: data.name, id: data.id, pfp: data.avatar_url });
    const exists = await userExists(data.login);
    if (exists == null || exists == false) {
        console.log("User does not exist in database, adding now")
        await addUser(data.login);
    } else {
        console.log("User exists in database")
    }
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/userdata", async (req, res) => {
    res.json(userdata);
})

app.get("/userInfo", async (req, res) => {
    let userID = userdata[0].username;
    let myUser = await getUserInfo(userID);
    res.json(myUser);
})

app.get("/allUsers", async (req, res) => {
    let userData = await allUsers();
    res.json(userData);
})

app.get("/userHistory", async (req, res) => {
    let userID = userdata[0].username;
    let history = await getUserGameHistory(userID);
    res.json(history);
})

// Send gameId, winnerId and loserIds in order of [2nd, 3rd, 4th, etc...]
app.post("/concludeGame", async (req, res) => {
    const { gameID, playerIDs } = req.body;
    //First to last place
    await concludeGame(gameID, playerIDs)
    res.send("Game Concluded")
})

run().catch(console.dir);

server.listen(3000)

// Add a user into the database, use GitHub username as userID (?)
async function addUser(userID) {
    try {
        const db = client.db("webwareFinal");
        const collection = db.collection("users");

        // Define the document you want to insert
        const document = {
            userID: userID,
            wins: 0,
            losses: 0,
            history: [],
        };
        const result = await collection.insertOne(document);
        console.log(`Inserted document with _id: ${result.insertedId}`);
    } catch (err) {
        console.error("Error inserting document:", err);
    }
}

// Creates a game entry and returns the game ID as a string. All other fields are empty as default
async function createGame() {
    try {
        const db = client.db("webwareFinal");
        const collection = db.collection("games");

        // Define the document you want to insert
        const document = {
            gameID: "",
            winner: "",
            winnerOrder: [],
        };
        const result = await collection.insertOne(document);
        console.log(`Inserted document with _id: ${result.insertedId}`);

        const stringID = result.insertedId.toString()

        const result2 = await collection.updateOne({ _id: result.insertedId },
            { $set: { gameID: stringID } });
        
        gameID = stringID;
        return stringID;

    } catch (err) {
        console.error("Error inserting document:", err);
    }
}

async function userExists(userID) {
    try {
        const db = client.db("webwareFinal");
        const collection = db.collection("users");

        // Define the document you want to insert
        const user = await collection.findOne({ userID: userID });
        return !!user;
    } catch (err) {
        console.error("Error checking users:", err);
    }
}

// Add a win to a user's account
async function addWin(userID) {
    try {
        const db = client.db("webwareFinal");
        const collection = db.collection("users");

        const result = await collection.updateOne({ userID: userID },
            { $inc: { wins: 1 } });

        // Log the result
        console.log(`Added win to ${userID}`);
    } catch (err) {
        console.error("Error adding win:", err);
    }
}
//Add a loss to a user's account
async function addLoss(userID) {
    try {
        const db = client.db("webwareFinal");
        const collection = db.collection("users");

        const result = await collection.updateOne({ userID: userID },
            { $inc: { losses: 1 } });

        // Log the result
        console.log(`Added loss to ${userID}`);
    } catch (err) {
        console.error("Error adding loss:", err);
    }
}

// Add a game to the user's history
async function addGameHistory(userID, gameID) {
    try {
        await client.connect();
        const db = client.db("webwareFinal");
        const collection = db.collection('users');

        // Find the user document with the matching userID
        const user = await collection.findOne({ userID: userID });

        if (!user) {
            console.error(`User with ID ${userID} not found`);
            return; // Exit the function if user is not found
        }

        // Update the user document to add gameID to the history array
        const result = await collection.updateOne(
            { userID: userID },
            { $push: { history: gameID } }
        );

        console.log(`Added game ${gameID} to history of user ${userID}`);
        return result;
    } catch (err) {
        console.error("Error adding game history:", err);
        throw err; // Re-throw the error to handle it where the function is called
    }
}

// Set the winner of a game
async function updateWinner(gameID, userID) {
    try {
        // Connect to the database
        const db = client.db("webwareFinal");

        // Update the document
        const result = await db.collection('games').updateOne(
            { gameID: gameID },
            { $set: { winner: userID } }
        );

        if (result.modifiedCount === 1) {
            console.log('Winner updated successfully.');
        } else {
            console.log('No document updated.');
        }
    } catch (err) {
        console.log('Error occurred while updating winner:', err);
    }
}

// Call to end a game. Adds win/loss data to players and sets history. Takes in a gameID and array of playerIDs
// playerIDs needs to be in order [1st, 2nd, 3rd, 4th, etc.]
async function concludeGame(gameID, playerIDs) {
    // Add a win to winner, add game to user history, set winner of game
    await setWinnerOrder(gameID, playerIDs)
    console.log(playerIDs)
    let winnerID = playerIDs.shift()
    console.log(winnerID)
    await addWin(winnerID);
    await addGameHistory(winnerID, gameID)
    await updateWinner(gameID, winnerID)

    for (let loserID of playerIDs) {
        console.log(loserID)
        await addLoss(loserID)
        await addGameHistory(loserID, gameID)
    }

    console.log(`The game is over! ${winnerID} wins!`)
}

async function allUsers() {
    try {
        const db = client.db("webwareFinal");
        const collection = db.collection("users");
        return await collection.find({}).toArray();
    } catch (error) {
        console.error('Error retrieving documents:', error);
        return null;
    }
}

// Set the winner order of a game.
async function setWinnerOrder(gameID, playerArray) {
    try {
        const db = client.db("webwareFinal");
        const collection = db.collection("users");
        const result = await collection.updateOne(
            { gameID: gameID },
            { $set: { winnerOrder: playerArray } }
        );

    } catch (err) {
        console.error("Error setting winner: ", err);
    }

}

// Get database entry for userID
async function getUserInfo(userID) {
    try {
        const db = client.db("webwareFinal");
        const collection = db.collection("users");
        const myUser = collection.findOne({ userID: userID });
        console.log(myUser);
        return myUser;
    } catch (err) {
        console.error("Error adding loss:", err);
    }
}
// Get array of game data from user info
async function getUserGameHistory(userID) {
    try {
        const db = client.db("webwareFinal");
        const collection = db.collection("users");
        const myUser = await collection.findOne({ userID: userID });
        const history = myUser.history
        let gameData = []
        for (let gameID of history) {
            let game = await db.collection("games").findOne({ gameID: gameID })
            gameData.push(game)
        }
        return gameData;
    } catch (err) {
        console.error("Error getting user game history: ", err);
    }
}