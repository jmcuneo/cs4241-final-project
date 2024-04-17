const express = require( 'express' ),
      app = express(),
      path = require('path')

require('dotenv').config()

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null,
    dbName = "CHANGE ME",
    collectionName = "CHANGEMETOO"

async function run() {


    await client.connect();
  
    collection = await client.db(dbName).collection(collectionName);
  
    app.get("/docs", async (req, res) => {
      if (collection !== null) {
        const docs = await collection.find({}).toArray()
        res.json(docs)
      }
    })
  }
  run()
  
  app.use((req, res, next) => {
    if (collection !== null) {
      next()
    } else {
      res.status(503).send()
    }
  })
  
  app.post('/add', async (req, res) => {
    const result = await collection.insertOne(temp)
    res.json(result)
  })
  
  app.post('/remove', async (req, res) => {
    const result = await collection.deleteOne({
      _id: new ObjectId(req.body._id)
    })
  
    res.json(result)
  })
  
  app.post('/update', async (req, res) => {
    const result = await collection.updateOne(
      { _id: new ObjectId(req.body._id) },
      { $set: { /*json here*/} }
    )
  
    res.json(result)
  })
  //DATABASE CONNECTION END



app.listen( process.env.PORT || 3000 )