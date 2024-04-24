const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors"); // Import CORS middleware
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

app.use(express.static(path.join(__dirname, "src")));
app.use(express.json()); 
app.use(cors()); 

app.post("/submit", async (req, res) => {
  try {
    const newData = req.body; 

    await dataCollection.insertOne(newData);

    const updatedData = await dataCollection.find().toArray();

    res.json(updatedData);
  } catch (error) {
    console.error("Error while processing /submit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/get", async (req, res) => {
  const data = await dataCollection.find().toArray();
  res.json(data);
});

app.post("/delete", async (req, res) => {
  await dataCollection.deleteOne({ _id: new ObjectId(req.body._id) });
  const data = await dataCollection.find().toArray();
  res.json(data);
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});