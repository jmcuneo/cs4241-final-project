import express from "express";
import ViteExpress from "vite-express";
import {MongoClient} from "mongodb";
import cors from "cors";
const client = new MongoClient(process.env.API_URL);

const app = express();
app.use(express.json());
app.use( express.urlencoded({ extended:true }) );
app.use(cors({origin: "*"}));
let collection = null;

async function run() {
    await client.connect();
    collection = await client.db("WordChain").collection("HighScore");

    // route to get all docs
    app.get("/docs", async (req, res) => {
        if (collection !== null) {
            const docs = await collection.find({}).toArray();
            res.json(docs);
        }
    });
}

run();

app.use((req, res, next) => {
    if (collection !== null) {
        next();
    } else {
        res.status(503).send();
    }
});

app.get("/", (req, res) => {
    try {
        collection.find({}).toArray().then((data) => {
            res.status(200).send(data);
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post("/add", (req, res) => {
    try {
        const body = {
            username: req.body.username,
            score: req.body.score
        };

        collection.insertOne(body).then((data) => {console.log("SUCCESS!", data); res.status(200).send("success"); });
    } catch (err) {
        console.log(err);
        res.status(400).send("Entry Creation Failed!");
    }
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
