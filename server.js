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
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory where images will be stored
    },
    filename: function (req, file, cb) {
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
    if (userCollection) {
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
                done(null, currentUser);
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
    res.json({ "username": req.user.username });
})

app.get("/user-events", async (req, res) => {
    userCollection.findOne({
        userId: req.user.userId
    })
        .then((user) => user.events)
        .then((events) => {
            if (events.length === 0) {
                return res.json([]);
            } else {
                let query = { $or: [] };
                events.forEach((e) => query.$or.push({ _id: new ObjectId(e.eventId) }));
                return eventsCollection.find(query).toArray().then(eventList => res.json(eventList));
            }
        });
});

app.post("/add-user-event", express.json(), async (req, res) => {
    res.send(await addUserEvent(req.user.userId, req.body.eventId));
});

async function addUserEvent(userId, eventId) {
    return userCollection.findOne({
        userId: userId
    }).then((user) => user.events).then((events) => {
        userCollection.updateOne(
            {
                userId: userId
            }, {
            $addToSet: {
                events: { eventId: eventId }
            }
        });
    });
}

app.post("/description", async (req, res) => {
    if (req.body == "") {
        return res.send(JSON.stringify('No description uploaded.'))
    }
    description = req.body;
    res.send(JSON.stringify("Uploaded successfully."));
})

//submit - gets entry (name, date, time, loaction) from client checks for event of same time, name, location
// adds to array and database and sends client updated array
app.post("/submit", upload.single('image'), async (req, res) => {
    let data = req.body;
    const eventExists = await eventsCollection.findOne({ event: data.event });
    if (eventExists != null) {
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
    console.log("File", req.file);
    let image = "";
    if (req.file !== undefined)
        image = '/uploads/' + req.file.filename;
    const entry = {
        event: event,
        date: date,
        image: (image === "" ? null : image),
        startTime: startTime,
        endTime: endTime,
        location: location,
        description: description
    }

    const result = await eventsCollection.insertOne(entry);
    res.json(await eventsCollection.find({}).toArray());
    await addUserEvent(req.user.userId, result.insertedId.toString());
});

app.post("/info", async (req, res) => {
    const details = await eventsCollection.findOne({ _id: new ObjectId(req.body.eventId) });
    res.send(details);
});

app.post("/refresh", express.json(), async (req, res) => {
    const mongoData = await eventsCollection.find({}).toArray();
    res.json(mongoData);
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
    if (postCollection !== null) {
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
ViteExpress.bind(app, server)