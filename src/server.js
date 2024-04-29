const express = require("express"),
  app = express(),
  path = require("path"),
  auth = require("./auth"),
  db = require("./db"),
  helpers = require("./helpers"),
  requests = require("./requests"),
  ghlogin = require("./gh-login"),
  { ObjectId } = require("mongodb"),
  https = require('https')
  url = require("url");

var GitHubStrategy = require("passport-github2").Strategy,
  passport = require("passport");

require("dotenv").config();
const privateKey = fs.readFileSync('/etc/letsencrypt/live/lgbt-matching.bixler.me/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/lgbt-matching.bixler.me/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/lgbt-matching.bixler.me/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("at: ", accessToken, "rt: ", refreshToken, profile, cb);
    }
  )
);
/* const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
 */
db.run();

let inMemCache = null;

app.use((req, res, next) => {
  if (db.exists) {
    next();
  } else {
    res.status(503).send();
  }
});
app.get("/.well-known/acme-challenge/7wfVfBorDT1GxVxRmhHS6lBYf85WrkEARWk96MtIMU0", (req, res) => {
  res.send("7wfVfBorDT1GxVxRmhHS6lBYf85WrkEARWk96MtIMU0.JnjgCrFUId2HcMMJIvR7NfXpoP-Ra5HmZZf2pQdmFFM").end();
})
app.post("/add", async (req, res) => {
  console.log(req);
  const existsByUsername = await db.getUserByUsername(req.body.username);
  const existsByEmail = await db.getUserByEmail(req.body.email);
  console.log(existsByUsername);
  let result = false;
  const validEmail = await auth.validateEmail(req.body.email);
  console.log("email validitittyy", validEmail);
  if (existsByUsername === null && existsByEmail === null && validEmail) {
    console.log("nope");
    const hash = await auth.genHashSalt(req.body);
    /* dbe means database entry */
    const dbe = {
      username: req.body.username,
      password: hash,
      name: req.body.name,
      email: req.body.email,
    };
    result = db.createUser(dbe);
  }
  if (result) res.status(200).send({ message: "user created" });
  /** TODO Implement the helper for the message */ else {
    const message = await helpers.addUserMessageHelper(
      existsByUsername,
      existsByEmail,
      validEmail
    );
    res
      .status(403)
      .send({ message: message ? message : "an unknown error hath occured" });
  }
});
app.get("/login", (req, res) =>{
  res.sendFile(path.join(__dirname,"public", "login.html"))
})
app.get("/", (req, res) => {
  res.redirect("/login")
})
app.get("/play-game", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "game.html"))
})
app.post("/login/auth", async (req, res) => {
  console.log(await req.body);
  let user = await db.getUserByUsername(req.body.username);
  if (!user) user = await db.getUserByEmail(req.body.email);
  let validLogin = false;
  if (user !== null) {
    validLogin = await auth.validatePasswordHash(req.body, user);
    console.log(validLogin);
  }
  if (validLogin)
    res
      .status(200)
      .json(auth.generateAccessToken({ username: user.username }));
  else res.status(400).send("bad login");
});
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

app.post("/load", async (req, res) => {
  inMemCache = await db.getCards();
  
  res.send(JSON.stringify(inMemCache))
})

app.post("/select", async (req, res) => {
  console.log(req.body)
  let item1 = req.body.item1,
      item2 = req.body.item2,
      curr_time = req.body.timeElapsed, //not sure what to do with time...
      
      curr_score = helpers.calculateScore(item1, item2, inMemCache);
      console.log(curr_score)
  
  res.json({score: curr_score})
  
})



app.post("/auth/add-leaderboard-entry",  auth.authenticateToken, async (req, res) => {
  console.log(req.user)
  const entry = await db.addLeaderboardEntry({
    username: req.user.username,
    score: Number(req.body.score),
    time: Number(req.body.timeElapsed)
  })

  res.status(200).end()
})
app.post("/leaderboard", async (req, res) => {
 const leaderboard =  await db.getLeaderboard();
 res.json(leaderboard)
})


app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }), ()=>console.log("gh called")
);

app.get("/auth/github/callback", async function (req, res) {
  const code = req.query.code;
  const emails = await requests.fetchEmailsByAccessToken(code);
  const user = await ghlogin.getUserWithGhEmail(emails);
  if(user){
    let responseUrl = url.format({
      pathname:"/auth/github/callback/cookie",
      query: {
         "token": auth.generateAccessToken({ username: user.username }),
       }})
    res
    .status(200)

    .redirect(responseUrl)
  } else {
    res.status(403).message("no user exists with any of the emails associated your github account")
  }
  console.log(code);
  console.log();

  // Successful authentication, redirect home.
  /* res.redirect("/"); */
});
app.get('/auth/github/callback/cookie', async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "redirect.html"))
})
//DATABASE CONNECTION END
app.post('/auth/test', auth.authenticateToken, (req, res) => {

  console.log("success????")
  res.status(200).end()
})
process.on('exit', () => {
  db.close();
});
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});