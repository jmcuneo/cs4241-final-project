const express = require('express');
const path = require('path');
const cookie  = require( 'cookie-session' );
const history = require('connect-history-api-fallback');

const app = express();

// Handle SPA history mode
app.use(history({
  verbose: true // This is optional but can be helpful for debugging
}));

app.use(express.static(path.join(__dirname, 'dist')));
app.use( cookie({
  name: 'a3-shiming',
  keys: ['azu109', 'sde'],
  maxAge: 24 * 60 * 60 * 1000
}))

const logger = (req,res,next) => {
  console.log( 'url:', req.url );
  next();
}

app.use( logger );

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://deshiming:ming@webware.yfjup5c.mongodb.net/?retryWrites=true&w=majority&appName=Webware`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
client.connect();

app.post( '/login', async (req, res) => {
  //TODO Login
  try {
    const collection = await client.db("hwDB").collection('userDB');
    const {username, password} = req.body;
    const user = await collection.findOne({username});

    if (user && password === user.password) {
      req.session.login = true
      current = username;
      res.status(200).redirect('main.html');
    } else {
      res.status(400).redirect('index.html');
    }
  }catch (error){
    res.status(500).send(error.message);
  }
});

app.post('/register', async (req, res) => {
  //TODO Register
  try {

    const { email, username, password, role } = req.body;

    const collection = await client.db("hwDB").collection('userDB');
    const userExists = await collection.findOne({ username });

    if (userExists) {
      return res.status(400).send('Username already exists');
    }

    await collection.insertOne({username: username, password: password});
    res.status(201).send('User created');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/data', async (req, res) => {
  //TODO Get all task for a user
  try {
    const {username} = req.body;
    const collection = await client.db("hwDB").collection('db0');

    const data = await collection.find({owner: username}).toArray();
    res.status(201).json(data);
  }catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/modify', async (req, res) => {
  //TODO modify an existing task
  try {
    const {game, name, uid, server, owner} = req.body;

    const collection = await client.db("hwDB").collection('db0');
    const result = await collection.updateOne(
      { uid: uid },
      { $set: req.body }
    )
    if (result.matchedCount === 0) {
      return res.status(404).send('No data found for the user to update.');
    }
    res.send('Data updated successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete('/delete', async (req, res) => {
  //TODO delete a task
  try {
    const {uid} = req.body; // Data to update
    const collection = await client.db("hwDB").collection('db0');
    const result = await collection.deleteOne({ uid: uid });

    if (result.deletedCount === 0) {
      return res.status(404).send('No data found for the user to delete.');
    }

    res.send('Data deleted successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
