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
  collection = await switcher("cards-people"); //CHANGE TO NAME OF PEOPLE DATABASE

  let rand_arr, card_array = [];
  while(rand_arr.length < 6){
    let num = Math.floor(Math.random() * 10);
    if(arr.indexOf(num) === -1) arr.push(num);
}
console.log(rand_arr); //TESTING
let i = 0;
while (i < rand_arr.length) {
  card_array.push(await collection.findOne(/* The index in the rand array...? */))
  i++
}
i = 0
collection = await switcher("cards-events"); //CHANGE TO NAME OF EVENT DATABASE
while (i < rand_arr.length) {
  card_array.push(await collection.findOne(/* The index in the rand array...? */))
  i++
}
/* This will format the card_array as 1, 2, 3, 4, 5,..., 1n, 2n, 3n, 4n, 5n... 
  where each number is a random index pairing of people and events 
  In order to check matching, we will have to check the index with + 6
*/


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