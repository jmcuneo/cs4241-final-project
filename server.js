import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let db = null;
let userData = null;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.use(express.urlencoded())
app.use(express.static("public"));
app.use(
  session({
    secret: "i love javascript",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
app.use(express.json())

const auth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
};

async function connect() {
  await client.connect();
  db = await client.db("final_db");
  userData = await db.collection("userData");
}

connect();

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

async function validateUser(user, pass, github) {
  if (user === "" || (pass === "" && github === false)) {
    return false;
  }
  const login = await db.collection("login");
  if (login !== null) {
    const acc = await login.findOne({ user: user });
    if (acc != null) {
      return acc.pass === pass;
    } else {
      login.insertOne({ user: user, pass: pass });
      createUser(user);
    }
  }
  return true;
}

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/user_exists", async (req, res) => {
  const login = await db.collection("login");
  if (login !== null) {
    let user = await login.findOne({ user: req.query.user });
    let resp = +(user !== null);
    res.writeHead(200, "OK", { "Content-Type": "text/plain" });
    res.write("" + resp);
    res.end();
  }
});


app.post("/login", async (req, res, next) => {
  // let data = req.query;
  const login = await validateUser(req.body.user, req.body.pass, false);
  if (login) {
    let user = {username: req.body.user};
    req.login(user, function(err) {
      if (err) { return next(err); }
      return res.redirect("/");
    });
  } else {
    res.redirect("/login_test.html?failed=1&user=" + req.body.user)
  }
});

async function createUser(user) {
  let newUser = {
    "user": user,
    "time": 0,
    "goatbucks": 0,
    "restaurant": []
  }
  userData.insertOne(newUser)
}

app.get("/load", auth, async (req, res) => {
  let userD = {}
  userD = await userData.findOne({user: req.user.username});
  res.writeHead(200, "OK", { "Content-Type": "application/json" });
  res.write(JSON.stringify(userD));
  res.end();
})

app.post("/save", auth, async (req, res) => {
  console.log(req.body)
  await userData.updateOne({user: req.user.username}, {$set: req.body})

  res.writeHead(200, "OK", { "Content-Type": "application/json" });
  res.write(JSON.stringify({"goatbucks": req.body.goatbucks}));
  res.end();
});

app.get("/scores", async (req, res) => {
  const opts = {
    projection: {"user": 1, "goatbucks": 1, "_id": 0},
    sort: {goatbucks: -1}
  }
  let scores = await userData.find({}, opts).toArray()
  console.log(scores)
  res.writeHead(200, "OK", { "Content-Type": "application/json" });
  res.write(JSON.stringify(scores));
  res.end();
})


app.listen(3000);