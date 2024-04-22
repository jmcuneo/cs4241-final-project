//import session from 'express-session';
import {MongoClient, ServerApiVersion, Timestamp} from 'mongodb';
//import MongoDBStore from 'connect-mongodb-session';


// setup Mongo
const uri = `mongodb+srv://approximatewhomst:gu3$$wh0@cluster0.8raq25j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// const store = new (MongoDBStore(session))({
//     uri: uri,
//     databaseName: 'a3',
//     collection: 'sessions'
// });

let pokemon_collection = null;

let games_collection = null;

const exp = { set_up_db_store, client, DB: null, getNumPokemon, getPokemonFromGame, getGameByRoomCode, updateGame, createNewGame, deleteGame, pushGame}
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        // Update our collections
        pokemon_collection = client.db("ApproximateWhomst").collection("Pokemon")
        games_collection =  client.db("ApproximateWhomst").collection("Game_Objects")
    } catch (err) {
        console.log(err)
    }
}

async function getNpokemon(N) {
    const cursor = await pokemon_collection.aggregate([
        // { $match: { a: n } },
        { $sample: { size: N } }
    ]);
    return await cursor.toArray();
}

run().catch(console.dir);

function set_up_db_store(app) {
    // check database exists
    app.use((req, res, next) => {
        if (pokemon_collection !== null) {
            next()
        } else {
            res.status(503).send()
        }
    })


    // check session
    // app.use(session({
    //     store, secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true,
    //     cookie: {
    //         maxAge: 1000 * 60 * 60 * 3 // 3 hours
    //     },
    // }));


    // Query to fetch Pokemon data from server from a unique id

}


async function getNumPokemon(){
    const count = await pokemon_collection.countDocuments();
    return count;
}


async function getPokemonFromGame(code, index){
    const docs = await games_collection.find(
        {
            roomCode: code
        }
    ).toArray()

    if(docs[0] === undefined)
    {
        //Room code not found
        return null;
    }
    else
    {
        return docs[0].board[index];
    }
}


async function getGameByRoomCode(code){
    const docs = await games_collection.find(
        {
            roomCode: code
        }
    ).toArray()

    if(docs[0] === undefined)
    {
        //Room code not found
        return null;
    }
    else
    {
        return docs[0];
    }
}

async function updateGame(code,variable,value){
    const filter = {
        roomCode:code
    };
    const updateDocument = {
        $set:{}
    };
    updateDocument["$set"][variable]=value;
    return await games_collection.updateOne(filter,updateDocument);
}

async function pushGame(code,variable,value){
    const filter = {
        roomCode:code
    };
    const updateDocument = {
        $push:{

        }
    }
    updateDocument["$push"][variable]=value;
    return await games_collection.updateOne(filter,updateDocument);
}



async function createNewGame(code,gameType){

    //Check if this game exists
    const docs = await games_collection.find(
        {
            roomCode: code
        }
    ).toArray()

    if(docs[0] === undefined) //If a game of this code does not exist
    {

        //Create a game-board with 24 random tiles using the type [Returns an array of 24 DB objects]
        let board = await getNpokemon(24);
        let guessedArr = [];
        for(let i = 0; i < 24; i++){
            guessedArr.push(false);
        }

        let newGame =
            {
                roomCode:code,
                type:gameType,
                board: board, //Replace with board when createNewBoard() is implemented
                chat:[
                    
                ],
                answer_p1:Math.floor(Math.random() * 24), //Do the random generation here?
                answer_p2: Math.floor(Math.random() * 24),
                flipped_p1:[...guessedArr],
                flipped_p2:[...guessedArr],
                guessed_p1:[...guessedArr],
                guessed_p2:[...guessedArr],
                started: new Date(),
                p1:null,
                p2:null,
                playAgain_p1:false,
                playAgain_p2:false
            };

        const addGame = await games_collection.insertOne(newGame)
        console.log("Added new game!");
        //Respond with the new game object that is in the DB
        return newGame;

    }
    else
    {
        console.log("Game already exists!");
        //Game code already exists
        return null;
    }
}

async function deleteGame(code)
{
    const docs = await games_collection.find(
        {
            roomCode: code
        }
    ).toArray()

    games_collection.deleteOne(docs[0]);
}


//DB Maintenance

var now = new Date();
let interval = 60 * 60 * 100; //10 minutes in MS
var start = interval - (now.getMinutes() * 60 + now.getSeconds()) * 100 + now.getMilliseconds();

setTimeout(async function delete_timeout_elements()
{
    console.log("Deleting all old elements")

    let last_interval = new Date();
    last_interval.setMinutes(last_interval.getMinutes() - 30) //delete all games 30 min ago
    console.log(last_interval)

    let deletion = await games_collection.deleteMany(
        {
            started: {$lt: last_interval}
        }
    )

    console.log(await deletion)


    setTimeout(delete_timeout_elements, interval)
}, start)



console.log(client.db("ApproximateWhomst").collection("Game_Objects").findOne({}));

export default exp;