import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import session from "express-session";
import passport from "passport";
// import gh2 from "passport-github2";
import dotenv from "dotenv";

// var GitHubStrategy = gh2.Strategy;
const app = express();
dotenv.config();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let db = null;
let userData = null;

//1 time unit = 10 seconds
let time = 0;
setInterval(() => {time++;}, 10000);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: "a2f861be70a70fbdd144",
//       clientSecret: "e8c5f26c527590f56f32643827edd6ac00668a08",
//       callbackURL: "https://a4-patrick-hunter.glitch.me/auth/github/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       process.nextTick(function () {
//         return done(null, profile);
//       });
//     }
//   )
// );

app.use(
  session({
    secret: "i love javascript",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
app.use(express.json())

// app.get(
//   "/auth/github",
//   passport.authenticate("github", { scope: ["user:email"] }),
//   function (req, res) {}
// );

// app.get(
//   "/auth/github/callback",
//   passport.authenticate("github", { failureRedirect: "/login" }),
//   async function (req, res) {
//     const login = await validateUser(req.user.username, "", true);
//     res.redirect("/html/boxes.html");
//   }
// );

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

// let lock = 0;
// async function getNextID(username) {
//   //bad lock system?
//   while(lock == 1);
//   lock = 1;
//   const userC = await db.collection(username);
//   if (userC !== null) {
//     const years = await userC
//       .find({}, { year: 1 })
//       .sort({ year: -1 })
//       .toArray();
//     lock = 0;
//     return years.length;
//   } else {
//     await db.createCollection(username);
//   }
//   lock = 0;
//   return 0;
// }

async function updateScore(username) {
  let score = await getNextID(username);
  const ud = await db.collection("userData");
  if (ud !== null) {
    let q = { user: username };
    let ns = { $set: { score: score } };
    let o = { upsert: true };
    login.updateOne(q, ns, o);
  }
}

function elapse(session) {
  let sessionTime = session.lastTime
  session.lastTime = time;
  return time - sessionTime
}

// async function addBox(user, color) {
//   const nextID = await getNextID(user);
//   let newBox = { id: nextID, color: color };
//   db.collection(user).insertOne(newBox);
//   console.log(`Added a ${color} box for ${user}.`);
// }

connect();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

// app.post("/add_box", auth, (req, res) => {
//   let dStr = "";
//   req.on("data", function (data) {
//     dStr += data;
//   });

//   req.on("end", async function () {
//     let data = JSON.parse(dStr);
//     await addBox(req.user.username, data.color);
//     updateScore(req.user.username);
//     res.send("Received request for add_box...");
//   });
// });

// app.post("/rmv_box", auth, (req, res) => {
//   let dStr = "";
//   req.on("data", function (data) {
//     dStr += data;
//   });

//   req.on("end", async function () {
//     let data = JSON.parse(dStr);
//     const userC = await db.collection(req.user.username);
//     if (userC !== null) {
//       const box = { id: parseInt(data.id) };
//       await userC.deleteOne(box);
//       updateScore(req.user.username);
//       res.send("Deleted box.");
//     } else {
//       res.send("Error: no collection exists for this user.");
//     }
//   });
// });

// app.post("/paint_box", auth, (req, res) => {
//   let dStr = "";
//   req.on("data", function (data) {
//     dStr += data;
//   });

//   req.on("end", async function () {
//     let data = JSON.parse(dStr);
//     const userC = await db.collection(req.user.username);
//     if (userC !== null) {
//       console.log(data);
//       const box = { id: parseInt(data.id) };
//       const newcolor = { $set: { color: data.color } };
//       userC.updateOne(box, newcolor);
//       res.send("Painted box.");
//     } else {
//       res.send("Error: no collection exists for this user.");
//     }
//   });
// });

// app.get("/get_boxes", async (req, res) => {
//     const userC = await db.collection(req.user.username);
//     if (userC !== null) {
//       let boxes = await userC.find({}).toArray();
//       res.writeHead(200, "OK", { "Content-Type": "application/json" });
//       res.write(JSON.stringify(boxes));
//       res.end();
//     } else {
//       getNextID(req.user.username);
//       res.writeHead(200, "OK", { "Content-Type": "application/json" });
//       res.write(JSON.stringify([]));
//       res.end();
//     }
// });

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


app.get("/login", async (req, res, next) => {
  let data = req.query;
  const login = await validateUser(data.user, data.pass, false);
  if (login) {
    let user = {username: data.user};
    req.login(user, function(err) {
      if (err) { return next(err); }
      return res.redirect("/html/boxes.html");
    });
  } else {
    res.redirect("/")
  }
});

// app.post("/try_login", async (req, res, next) => {
//   let dStr = "";
//   req.on("data", function (data) {
//     dStr += data;
//   });

//   req.on("end", async function () {
//     let data = JSON.parse(dStr);
//     const login = await validateUser(data.user, data.pass, false);
//     if (login) {
//       res.writeHead(200, "OK", { "Content-Type": "text/plain" });
//       res.write("1");
//       res.end();
//     } else {
//       res.writeHead(200, "OK", { "Content-Type": "text/plain" });
//       res.write("0");
//       res.end();
//     }
//   });
// });

function generateGoatbucks(req, prev) {
  let time = elapse(req.session)
  let extraGB = time;
  //do stuff w/ data
  return extraGB + prev;
}

function setGoatbucks(req, bucks) {
  let q = { user: req.user };
  let ns = { $set: { score: bucks } };
  let o = { upsert: true };
  userData.updateOne(q, ns, o);
}

app.get("/goatbucks", async (req, res) => {
  const scores = await db.collection("userData");
  let score = 0
  if (scores !== null) {
    let options = {
      projection: { score: 1 },
    };
    score = await scores.find({user: req.query.user}, options)
    let newBux = generateGoatbucks(req, score)
  }

  res.writeHead(200, "OK", { "Content-Type": "application/json" });
  res.write(JSON.stringify(score));
  res.end();
});


app.listen(3000);