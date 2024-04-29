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

  const rand_arr = [], 
        card_array = [];
  let i = 0;
  while(rand_arr.length < 6){
    let num = Math.floor(Math.random() * 10);
    if(rand_arr.indexOf(num) === -1) {
      rand_arr.push(num);
      i++
    }
}

i = 0;
while (i < 6) {
  card_array.push(await collection.findOne({"index": rand_arr[i]}))
  i++
}

i = 0
collection = await switcher("cards-events"); //CHANGE TO NAME OF EVENT DATABASE
while (i < rand_arr.length) {
  card_array.push(await collection.findOne({"index": rand_arr[i]}))
  i++
}
/* This will format the card_array as 1, 2, 3, 4, 5,..., 1n, 2n, 3n, 4n, 5n... 
  where each number is a random index pairing of people and events 
  In order to check matching, we will have to check the index with + 6
*/

  return card_array
}

exports.getLeaderboard = async () => {
  collection = await switcher("leaderboard");
  let ret = [];
 /*  let result = await collection.find();
  console.log(await result) */
  const query = {};
  // sort in descending (-1) order by length
  const sort = { score: -1 };
  const limit = {limit: 2}
  const cursor = collection.find(query).sort(sort).limit(10);
  for await (const doc of cursor) {
    ret.push(doc)
    console.dir(doc);
  }
  console.log(ret);
  return ret;
}

exports.addLeaderboardEntry = async (entry) => {
  collection =  await switcher("leaderboard")
  const date =  new Date(Date.now());
  const datetime = date.toUTCString(); 
  entry.date = datetime;
  
  console.log(entry);
  await collection.insertOne(entry);  
}

const switcher = async (desired) => {
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