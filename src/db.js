const fs = require("fs");
const env = require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://ibixler:${process.env.PASS}@matchinglgbt.zyq3dy3.mongodb.net/?retryWrites=true&w=majority&appName=MatchingLGBT`;

let collection, collectionName;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


exports.run = async function () {
  try {
    console.log("trying to connect");
    await client.connect();
    collection = await switcher("users");
    console.log("connecting");
  } catch (err) {
    console.log(err);
  }
};

exports.exists = () => {
  return(!!(collectionName));
};
exports.close = async () => {
  await client.close();
};
exports.getUserByUsername = async function (username) {

  collection = await switcher("users");
  const user = await collection.findOne({ username });
  
  if (user) {
    console.log("User found with ID:", user._id);
    return user;
  } else {
    console.log("User not found with username:", username);
    return null;
  }
};
exports.getUserByEmail = async function (email) {

  collection = await switcher("users")
  const user = await collection.findOne({ email });
  if (user) {
    console.log("User found with ID:", user._id);
    return user;
  } else {
    console.log("User not found with username:", email);
    return null;
  }
};
exports.createUser = async function (data) {
  try {
    console.log("creating user");
    console.log(data);
    collection = await switcher("users")
    await collection.insertOne(data);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.getCards = async () => {

}

const switcher = (desired) => {
  try{
    if(collectionName === desired){
      return collection;
    } else{
      collectionName = desired;
      return client.db("matching-game").collection(collectionName);
    }

  } catch (err){
    console.err(err);
  }
}