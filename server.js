const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const path = require("path");

const uri = "mongodb+srv://webware:dbwebware@mycluster.9wcjhsy.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let dataCollection;

async function run() {
    try {
      await client.connect();
      dataCollection = client.db("mydatabase").collection("mycollection");
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Could not connect to DB:", error);
    }
  }
  run().catch(console.error);
  
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.json());

  app.post("/submit", async (req, res) => {
    await dataCollection.insertOne(req.body);
    const data = await dataCollection.find().toArray();
    res.json(data);
  });

  