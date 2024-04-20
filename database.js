//import session from 'express-session';
import { MongoClient, ServerApiVersion } from 'mongodb';
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

const exp = { set_up_db_store, client, DB: null }
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
    app.post('/get_pokemon_by_unique_id', async (req, res) => {
        const docs = await pokemon_collection.find(
            {
                unique_id: req.body.id
            }
        ).toArray();

        res.json(docs[0]);
        getNpokemon(24);
    })


    // Query to fetch the total number of Pokemon in the database
    app.get('/get_num_pokemon', async (req, res) => {
        const count = await pokemon_collection.countDocuments();
        res.json({count});
    })


    app.post('/get_pokemon_from_game', async (req, res) =>
    {
        let code = req.body.roomCode;
        let index = req.body.index;

        //Check if this game exists
        const docs = await games_collection.find(
            {
                roomCode: code
            }
        ).toArray()

        if(docs[0] === undefined)
        {
            res.json("RoomCodeNotFound")
        }
        else
        {
            res.json(docs[0].board[index]);
        }
    })


    app.post('/get_game_by_room_code', async (req, res) =>
    {
        let code = req.body.roomCode

        //Check if this game exists
        const docs = await games_collection.find(
            {
                roomCode: code
            }
        ).toArray()

        if(docs[0] === undefined)
        {
            res.json("RoomCodeNotFound")
        }
        else
        {
            res.json(docs[0])
        }
    })


    app.post('/create_new_game', async (req, res) =>
    {
        let code = req.body.roomCode

        //Check if this game exists
        const docs = await games_collection.find(
            {
                roomCode: code
            }
        ).toArray()

        if(docs[0] === undefined) //If a game of this code does not exist
        {
            let gameType = req.body.type

            //Create a game-board with 24 random tiles using the type [Returns an array of 24 DB objects]
            let board = await createNewBoard(gameType)

            let newGame =
                {
                    roomCode:code,
                    type:gameType,
                    board: board, //Replace with board when createNewBoard() is implemented
                    chat:[
                        { author:"server", msg:"player 1 joined the game"}, //Default chat message
                    ],
                    answer_p1:Math.floor(Math.random() * 23), //Do the random generation here?
                    answer_p2: Math.floor(Math.random() * 23),
                    flipped_p1:[],
                    flipped_p2:[],
                    guessed_p1:[],
                    guessed_p2:[],
                    started:1000000,
                    connected_players:[
                        {name:"Player 1",id:""}
                    ] //Only player 1 is connected by default, will be [1, 2] when player 2 connects
                }

                const addGame = await games_collection.insertOne(newGame)

            //Respond with the new game object that is in the DB
            res.json(addGame);

        }
        else
        {
            res.json("Game Code Already Exists!")
        }


    })

}


//Helper functions for handling DB creation

async function createNewBoard(gameType)
{
    console.log("creating a new gameboard")
    let board = []
    let boardElementsToFetch = [];

    //Handles pokemon games
    if(gameType === "pokemon")
    {
        let number_of_pokemon = 1025; //Hardcoded # of pokemon in DB

        //We will handle pokemon selection purely client-side, knowing we don't want any duplicates (saves runtime and guarantees we only need to query 24 times)
        for(let i = 0; i <= 23; i++)
        {
            let unique_found = false;

            while(!unique_found)
            {
                let rand = Math.floor(Math.random() * number_of_pokemon);

                if(!boardElementsToFetch.includes(rand))
                {
                    boardElementsToFetch.push(rand)
                    unique_found = true;
                }

            }
        }

        console.log(boardElementsToFetch)

        //Now fetch all elements and put them in the board array
        for(let i = 0; i <= 23; i++)
        {
            const docs = await pokemon_collection.find(
                {
                    unique_id: boardElementsToFetch[i]
                }
            ).toArray();

            board.push(docs)
        }
        console.log(board)
    }

    return board;
}

console.log(client.db("ApproximateWhomst").collection("Game_Objects").findOne({}));

export default exp;