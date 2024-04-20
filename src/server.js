const express = require("express"),
  app = express(),
  path = require("path"),
  const auth = require("./jwt");
  require("dotenv").config();
  
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const { connect } = require("http2");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
/* const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
 */
const uri = `mongodb+srv://ibixler:${process.env.PASS}@matchinglgbt.zyq3dy3.mongodb.net/?retryWrites=true&w=majority&appName=MatchingLGBT`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// Create a MongoClient with a MongoClientOptions object to set the Stable API version


let collection = null,
  dbName = "matching-game",
  collectionName = "users";

async function run() {
  console.log("trying to connect");
  await client.connect();

  collection = await client.db(dbName).collection(collectionName);
  console.log("connecting");
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

app.post("/add", async (req, res) => {
  console.log(req.body);
  const result = await collection.insertOne(req.body);
  /* res.json(result); */
  res.status(200).send({ message : "user"});
});

app.post("/remove", async (req, res) => {
  const result = await collection.deleteOne({
    _id: new ObjectId(req.body._id),
  });

  res.json(result);
});

app.post("/update", async (req, res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId(req.body._id) },
    {
      $set: {
        /*json here*/
      },
    }
  );

  res.json(result);
});
//DATABASE CONNECTION END
client.close();

app.listen(process.env.PORT || 3000);
