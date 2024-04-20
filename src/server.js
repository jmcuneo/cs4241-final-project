const express = require("express"),
  app = express(),
  path = require("path"),
  auth = require("./auth");
  db = require("./db")
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


/* let collection = 
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
run(); */
db.run();

app.use((req, res, next) => {
  if (1) {
    next();
  } else {
    res.status(503).send();
  }
});

app.post("/add", async (req, res) => {
  console.log(req.body);
  const exists = await db.getUserIdByUsername(req.body.username);
  console.log(exists);
  let result;
  if(exists === null){
    console.log("nope");
    db.createUser(req.body);
  }
  
  res.status(200).send({ message : "user"});
/*   else res.status(400).send({message: "fuck"})
 */  /* res.json(result); */
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
