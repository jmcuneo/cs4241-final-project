const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');

let current = '';
const app = express();

// Handle SPA history mode
app.use(history({
  verbose: true, // Enable for debugging purposes
  rewrites: [
    { from: /^\/api\/.*$/, to: function(context) { return context.parsedUrl.pathname; } }
  ]
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

const logger = (req,res,next) => {
  console.log( 'url:', req.url );
  next();
}

app.use( logger );

const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
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
    const collection = await client.db("finalDB").collection('user');
    const {username, password} = req.body;
    const user = await collection.findOne({username: username});
    if (user && password === user.password) {
      console.log("login success")
      current = username;
      res.status(200).send('Login successful');
    } else {
      console.log("login failed")
      res.status(400).send('Wrong username or password');
    }
  }catch (error){
    res.status(500).send(error.message);
  }
});

app.post('/register', async (req, res) => {
  //TODO Register
  try {

    const {username, password} = req.body;

    const collection = await client.db("finalDB").collection('user');
    const userExists = await collection.findOne({ username: username });

    if (userExists) {
      return res.status(400).send('Username already exists');
    }

    await collection.insertOne({username: username, password: password});
    res.status(201).send('User created');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/newpass', async (req, res) => {
  //TODO modify an existing task
  try {
    const {username, password} = req.body;

    const collection = await client.db("finalDB").collection('user');
    const result = await collection.updateOne(
      {username: username},
      {  $set: {password: password}}
    )
    if (result.matchedCount === 0) {
      return res.status(404).send('No data found for the user to update.');
    }
    res.send('Password updated successfully.');
  } catch (error) {
    console.error("Error occurred during deletion:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

app.get( '/user', async (req, res) => {
  try{
    if (current === ''){
      res.status(400).send('No User Logged in')
    }
    else{
      res.status(200).send(current);
    }
  }catch (error){
    res.status(500).send(error.message);
  }
})

app.get( '/logout', async (req, res) => {
  try{
    current = '';
    res.status(200).send(current);
  }catch (error){
    res.status(500).send(error.message);
  }
})

app.post('/data', async (req, res) => {
  //TODO Get all task for a user
  try {
    const {username} = req.body;
    const collection = await client.db("finalDB").collection('task');

    const data = await collection.find({owner: username}).toArray();
    res.status(201).json(data);
  }catch (error) {
    res.status(500).send(error.message);
  }
});

app.post( '/add', async (req, res) => {
  try{
    const collection = await client.db("finalDB").collection('task');

    const result = await collection.insertOne( req.body )
    res.json( result )
  }catch (error){
    res.status(500).send(error.message);
  }
})

app.put('/modify', async (req, res) => {
  //TODO modify an existing task
  try {
    const {_id, title, location, time, owner} = req.body;
    const json = {title: title, location: location, time: time, owner: owner},
      body = JSON.stringify(json);

    const collection = await client.db("finalDB").collection('task');
    const result = await collection.updateOne(
      {_id: new ObjectId('' + _id)},
      { $set: json }
    )
    if (result.matchedCount === 0) {
      return res.status(404).send('No data found for the user to update.');
    }
    res.send('Data updated successfully.');
  } catch (error) {
    console.error("Error occurred during deletion:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

app.delete('/delete', async (req, res) => {
  //TODO delete a task
  try {
    let {_id} = req.body; // Data to update
    if (!_id || !ObjectId.isValid(_id)) {
      return res.status(400).send('Invalid ID format');
    }
    const collection = await client.db("finalDB").collection('task');
    const result = await collection.deleteOne({_id: new ObjectId('' + _id)});
    if (result.deletedCount === 0) {
      return res.status(404).send('No data found for the user to delete.');
    }

    res.send('Data deleted successfully.');
  } catch (error) {
    console.error("Error occurred during deletion:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
