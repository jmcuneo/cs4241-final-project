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

const exp = {set_up_db_store, client, DB: null }
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        exp.DB = client.db("a3").collection("data");
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        // Update our collections
        pokemon_collection = await client.db("ApproximateWhomst").collection("Pokemon")

    } catch (err) {
        console.log(err)
    }
}

run().catch(console.dir);

function set_up_db_store(app) {
    // check database exists
    app.use((req, res, next) => {
        if (exp.DB !== null) {
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
    app.post('/get_pokemon_by_unique_id',async (req, res) =>
    {
        console.log(req.body)
        const docs = await pokemon_collection.find(
            {
                unique_id: 800
            }
        ).toArray();

        res.json(await docs)

    })

}




export default exp;