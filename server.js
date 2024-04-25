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
    await client.connect()
    const database = client.db('finalProj')
    userCollection = database.collection('users')
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
    userCollection.findOne({ "userId": id }).then((user) => {
        done(null, user);
    });
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
                    console.log("new user created:" + newUser)
                    done(null, newUser)
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
                    console.log(currentUser)
                    done(null, currentUser)
                } else {
                    const newUser = {
                        "userId": profile.id,
                        "username": profile.displayName,
                        "events": []
                    }
                    userCollection.insertOne(newUser).then(user => {
                        console.log("new user created:" + newUser)
                        done(null, newUser)
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
let currentUsername 

app.get('/loggedIn', authCheck, (req, res) => {
    console.log("ran loggedIn")
    res.sendFile(__dirname + '/public/loggedIn.html')
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
    req.session.login = false
    res.redirect('/');
});

app.get('/profilePage', authCheck, (req, res) => {
    res.sendFile(__dirname + '/public/profile.html')
})

app.get('/eventBoard', authCheck, (req, res) => {
    res.sendFile(__dirname + '/public/eventBoard.html')
})

app.get('/allEvents', authCheck, (req, res) => {
    res.sendFile(__dirname + '/public/viewEvents.html')
})

app.get('/user', (req, res) => {
    currentUsername = req.user.username;
    console.log("fetching username")
    res.json({"username" : req.user.username});
})

app.get("/user-events", async (req, res) => {
    console.log("fetching user events");
    userCollection.findOne({
        userId: req.user.userId
    })
    .then((user) => user.events)
    .then((events) => {
        console.log(events);
        if (events.length === 0) {
            return res.json([]);
        } else {
            let query = {$or: []};
            events.forEach((e) => query.$or.push({_id: new ObjectId(e.eventId)}));
            return eventsCollection.find(query).toArray().then((eventList) => {console.log(eventList);res.json(eventList)});
        }
    });
});

app.post("/add-user-event", express.json(), (req, res) => {
    userCollection.findOne({
        userId: req.user.userId
    }).then((user) => user.events).then((events) => {
        console.log(req.body);
        userCollection.updateOne(
            {
                userId: req.user.userId
            }, {
                $addToSet: {
                    events: {eventId: req.body.eventId}
            }
        }).then((response) => {console.log(response); res.send(response)});
    });
});

app.post("/submit", upload.single('image'), async (req, res) => {
    let data = req.body;
    const eventExists = await eventsCollection.findOne({event: data.event});
    if (eventExists != null) {
        console.log("Event already posted!");
        res.send(JSON.stringify("Event already posted!"));
        return;
    }
    const event = data.event;
    const date = data.date;
    const startTime = data.startTime;
    const endTime = data.endTime;
    const location = data.location;
    const description = data.description;
    // Access uploaded file from req.file
    const image = '/uploads/' + req.file.filename;
        const entry = {
            event: event,
            date: date,
            image: image,
            startTime: startTime,
            endTime: endTime,
            location: location,
            description: description
        }

    const result = await eventsCollection.insertOne(entry)
    res.json(await eventsCollection.find({}).toArray());
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
    const eventName = req.body.eventName;  
  
    const filter = { event: eventName };
    const foundItem = await eventsCollection.findOne(filter);
    
    res.send(foundItem);
    
  });

app.post("/refresh", express.json(), async (req, res) => {
    const mongoData = await eventsCollection.find({}).toArray();
    res.json(mongoData);
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
});




app.get('/messages', async (req, res) => {
    if(postCollection !== null){
        const messages = await postCollection.find().toArray();
        console.log("these are the stored messages before being sent\n" + messages.map(m => m.content))
        res.json(messages);
    }
});

server.listen(3000, function listening() {
    console.log('WebSocket server is listening on port 3000');
});

//app.listen(process.env.PORT);
//ViteExpress.listen(app, 3000);
ViteExpress.bind( app, server )