const express = require("express"),
  app = express(),
  path = require("path"),
  auth = require("./auth");
  db = require("./db")
  require("dotenv").config();
  const { ObjectId } = require("mongodb");
  
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());


/* const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
 */
const uri = `mongodb+srv://ibixler:${process.env.PASS}@matchinglgbt.zyq3dy3.mongodb.net/?retryWrites=true&w=majority&appName=MatchingLGBT`;

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
  const exists = await db.getUserByUsername(req.body.username);
  console.log(exists);
  let result = false;
  const validEmail = await auth.validateEmail(req.body.email);
  console.log("email validitittyy", validEmail)
  if(exists === null && validEmail){
    console.log("nope");
    const hash =  await auth.genHashSalt(req.body);
    /* dbe means database entry */
    const dbe = { username: req.body.username,
                  password: hash,
                  name: req.body.name,
                  email: req.body.email };
    result = db.createUser(dbe); 
  }
  if(result) res.status(200).send({ message : "user created"});
  else res.status(403).send({message: validEmail ? "user already exists, select a new username" : "invalid email provided try once more"});
});
app.post("/login", async(req, res ) => {
  console.log(req.body);
  const user = await db.getUserByUsername(req.body.username);
  let validLogin = false;
  if(user !== null){
    validLogin = await auth.validatePasswordHash(req.body, user);
    console.log(validLogin)
  }
  if (validLogin) res.status(200).json(auth.generateAccessToken({ username: req.body.username }));
  else res.status(400).send("bad login");
})
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

db.cl
app.listen(process.env.PORT || 3000);
