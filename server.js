const express = require('express'),
    ViteExpress = require("vite-express"),
    app = express(),
    { MongoClient, ObjectId } = require("mongodb"),
    WebSocket = require('ws'),
    http = require('http'),
    server = http.createServer(app),
    wss = new WebSocket.Server({ server });

//for sending files
const multer = require('multer');
const path = require('path');
//set up mutler
// Set up Multer to handle file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory where images will be stored
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid conflicts
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'))
app.use(express.static('views'))
app.use(express.json())

require("dotenv").config()

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri)

let userCollection;
let eventsCollection;
let postCollection;

(async function () {
    await client.connect();
    const database = client.db('finalProj');
    userCollection = database.collection('users');
    eventsCollection = database.collection("events");
    postCollection = database.collection('posts')
})();

const cookieSession = require('cookie-session')
const passport = require('passport');
const session = require('express-session');

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}));


app.use(session({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const GitHubStrategy = require('passport-github2').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.userId);
});

passport.deserializeUser((id, done) => {
    if(userCollection) {
        userCollection.findOne({ "userId": id }).then((user) => {
            done(null, user);
        });
    } else {
        console.error("User collection object not initialized when deserializing user!");
    }
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
},
    (accessToken, refreshToken, profile, done) => {
        userCollection.findOne({ "userId": profile.id }).then((currentUser) => {
            if (currentUser) {
                console.log(currentUser)
                done(null, currentUser)
            } else {
                const newUser = {
                    "userId": profile.id,
                    "username": profile.username,
                    "events": []
                }
                userCollection.insertOne(newUser).then(user => {
                    done(null, newUser);
                })
            }
        })
    }
));

const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect'
    },
        (accessToken, refreshToken, profile, done) => {
            userCollection.findOne({ "userId": profile.id }).then((currentUser) => {
                if (currentUser) {
                    done(null, currentUser);
                } else {
                    const newUser = {
                        "userId": profile.id,
                        "username": profile.displayName,
                        "events": []
                    }
                    userCollection.insertOne(newUser).then(user => {
                        done(null, newUser);
                    })
                }
            });
        })
);

//used for github auth
app.get('/github', passport.authenticate('github', {
    scope: ['profile']
}))

//checks to ensure that the user is authorized before getting to loggedIn.html
const authCheck = (req, res, next) => {
    if (!req.session.login) {
        res.redirect('/index.html')
    } else {
        next()
    }
};

//redirects to loggedIn.html if logged in
app.get('/loggedIn', authCheck, (req, res) => {
    res.sendFile(__dirname + '/public/home.html')
});

//defaults to login page 
app.get('/', (req, res) => {
    res.sendFile('index')
});

//handles redirect from github login
app.get('/auth/github/callback', passport.authenticate('github'), (req, res) => {
    req.session.login = true
    res.redirect('/loggedIn')
});


//google routes 
app.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    req.session.login = true
    res.redirect('/loggedIn');
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session.login = false;
    res.redirect('/');
});

app.get('/profilePage', authCheck, (req, res) => {
    res.sendFile(__dirname + '/public/profile.html');
})

//send to post event page
app.get('/eventBoard', authCheck, (req, res) => {
    res.sendFile(__dirname + '/public/eventBoard.html');
})

app.get('/allEvents', authCheck, (req, res) => {
    res.sendFile(__dirname + '/public/viewEvents.html');
})

app.get('/user', (req, res) => {
    res.json({"username" : req.user.username});
})

app.get("/user-events", async (req, res) => {
    userCollection.findOne({
        userId: req.user.userId
    })
    .then((user) => user.events)
    .then((events) => {
        if(events && events.len > 0) {
            let query = {$or: []};
            events.forEach((e) => query.$or.push({eventId: e.eventId}));
            return eventsCollection.find(query).toArray().then((eventList) => res.json(eventList));
        }

        return res.json([]);
    });
});
let eventPost = []; //array to store all events
let image; //for mopngoDB
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    image = '/uploads/' + req.file.filename;
    res.sendStatus(200);
});
let description; //mongoDB
app.post("/description", async (req, res) => {
    if(req.body == ""){
        return res.send(JSON.stringify('No description uploaded.'))
    }
    description = req.body;
    res.send(JSON.stringify("Uploaded successfully."));
})

//submit - gets entry (name, date, time, loaction) from client checks for event of same time, name, location
// adds to array and database and sends client updated array
app.post("/submit", async (req, res) => {
    let data = req.body;
    for(let i = 0; i < eventPost.length; i++){
      if(data.event == eventPost[i].event){
        res.send(JSON.stringify("Event already posted!"));
        return;
      } 
    }
    var entry = {
      //name: req.user.username, fix after appened to login page
      event: data.event,
      date: data.date,
      startTime: convertTime(data.startTime),
      length: elapsedTime(data.startTime, data.endTime, data.date), 
      location: data.location,
      image: image,
      description: description
    };
    eventPost.push(entry);
    const result = await eventsCollection.insertOne(entry)
    req.json = JSON.stringify(eventPost);
    res.send(req.json);
  });

  function convertTime(time) {
    // Parse the time string
    var timeSplit = time.split(':');
    var hours = parseInt(timeSplit[0]);
    var minutes = parseInt(timeSplit[1]);

    // Convert to 12 hour
    var ampm = (hours >= 12) ? 'PM' : 'AM';
    hours = (hours % 12) || 12;

    var newTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;
    return newTime;
}

function elapsedTime(startTime, endTime, date) {
    // full dates to get time differences for multi days
    var start = new Date(date + "T" + startTime + ':00');
    var end = new Date(date + "T" + endTime + ':00');

    // Calculate the difference in milliseconds
    var elapsedTime = end - start;

    // Convert milliseconds to hours and minutes
    var hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    var minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));

    return hours + ' hours ' + minutes + ' minutes';
}

app.post("/info", async (req, res) => {
    const indexToRemove = req.body.entryIndex;

    const details = eventPost[indexToRemove];
    const eventName = details.event;  
  
    // Use the attribute 'name' of the object to remove data from MongoDB
    const filter = { event: eventName }; // Filter to find the document by the original item
    const foundItem = await eventsCollection.findOne(filter);
    
    res.send(foundItem);
    
  });

let mongoDataLoaded = false;

app.post("/refresh", express.json(), async (req, res) => {
  if (!mongoDataLoaded) {
    // Load all data from MongoDB only if it hasn't been loaded before
    const mongoData = await eventsCollection.find({}).toArray();
    for(let i = 0; i < mongoData.length; i++){
      eventPost.push(mongoData[i]);
    }
}
  else{
    console.log("mongo already loaded");
  }
  
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(eventPost));
});

//websocket initialization 
wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        const decodedMessage = Buffer.from(message, 'base64').toString('utf-8');
  
        const post = {
            username: decodeURIComponent(req.url.split("=")[1]),
            anonymous: false,
            datetime: new Date().toLocaleString(),
            content: decodedMessage,
            upvotes: 0,
            downvotes: 0
        };

        postCollection.insertOne(post)
            .then(() => {
                
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(post));
                    }
                });
            })
            .catch((error) => {
                console.error('Error saving message:', error);
            });
    });
});


app.get('/messages', async (req, res) => {
    if(postCollection !== null){
        const messages = await postCollection.find().toArray();
        res.json(messages);
    } else {
        //Return empty list
        res.json([]);
    }
});

app.get('/personalPosts', async (req, res) => {
    if (postCollection !== null) {
        const messages = await postCollection.find({ username: req.user.username }).toArray();
        res.json(messages);
    }
});

server.listen(3000, function listening() {
    console.log('WebSocket server is listening on port 3000');
});

//app.listen(process.env.PORT);
//ViteExpress.listen(app, 3000);
ViteExpress.bind( app, server )