const fs = require("fs");
const env = require("dotenv").config();
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

let collection = (dbName = "matching-game"),
  collectionName = "users";

exports.run = async function () {
  try{
    console.log("trying to connect");
    await client.connect();
  
    collection = await client.db(dbName).collection(collectionName);
    console.log("connecting");
  } catch (err){
    console.log(err)
  } 
};

exports.exists = () => {
  collection !== null;
};
exports.close = () => {
  client.close();
}
exports.getUserByUsername = async function (username) {
  console.log("called");
  const user = await collection.findOne({ username });
  if (user) {
    console.log("User found with ID:", user._id);
    return user;
  } else {
    console.log("User not found with username:", username);
    return null;
  }
};
exports.createUser = async function (data) {
  try{
    console.log("creating user");
    console.log(data)
    await collection.insertOne(data);
    return true; 
  } catch (err){
    console.log(err)
    return false; 
  }
}; 

