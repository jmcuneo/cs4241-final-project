require("dotenv").config();
const fs = require('fs');
const express = require("express"),
    app = express(),
    path = require('path'),
    mime = require("mime"),
    cookieParser = require('cookie-parser'),
    dir = "public/",
    potrace = require('potrace'),
    multer = require('multer'),
    GridFsStorage = require('multer-gridfs-storage'),
    Grid = require('gridfs-stream'),
    Jimp = require('jimp'),
    http = require('https'),
    FormData = require('form-data'),
    fetch = require('node-fetch'),
    port = 3000;

// Include Firebase Admin SDK and MongoDB
const admin = require('firebase-admin');
const serviceAccount = require('./sharpify-2c8fc-firebase-adminsdk-jkwtn-0a02d3268b.json');
const MongoClient = require('mongodb').MongoClient;

//will this commit now?

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "sharpify-2c8fc.appspot.com"
});

const bucket = admin.storage().bucket();
let client;

const uri = `mongodb+srv://dovushman:${process.env.PASSWORD}@cluster0.vpfjttx.mongodb.net/a3-dovUshman?retryWrites=true&w=majority&appName=Cluster0`;

// MongoClient.connect(uri, function(err, client) {
//   if (err) throw err;
//   console.log("Connected successfully to MongoDB server");
//   client = client;
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const upload = multer({ dest: 'uploads/' });


app.use(express.static(path.join(__dirname, 'build')));

// const { MongoClient, ObjectId } = require('mongodb');


let db;
let users;
let images;


async function run() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("Connected to MongoDB!");

        db = client.db("finalProjectTempDatabase");
        console.log(`Connected to the database:${db.databaseName}`)

        users = db.collection("users");
        console.log(`Connected to the collection:${users.collectionName}`);

        // images = db.collection("images");

        // images = db.collection("images");

        images = db.collection("images");
        console.log(`Connected to the collection:${images.collectionName}`);

    } catch (error) {
        console.dir(error);
    }
}
run();

let namesArray = []

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/public/logIn.html")
})

app.use(express.static("public"));

app.post('/submit', upload.single('image'), async (request, response) => {
    // Check if file was uploaded
    if (!request.file) {
        return response.status(400).json({ message: 'No file uploaded' });
    }

    // Create a new document with the image's filename and path
    const imageDocument = {
        filename: request.file.filename,
        path: request.file.path,
        uploadDate: new Date()
    };

    try {
        // Insert the document into the 'images' collection
        const result = await db.collection('images').insertOne(imageDocument);

        // Send a response with the inserted document's ID
        response.json({ message: 'File uploaded successfully', id: result.insertedId });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error uploading file' });
    }
    try {
        // Insert the document into the 'images' collection
        const result = await db.collection('images').insertOne(imageDocument);

        // Send a response with the inserted document's ID
        response.json({ message: 'File uploaded successfully', id: result.insertedId });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error uploading file' });
    }
});

app.post("/signin", async (request, response) => {
    console.log("sign in post request received")
    const { email, password } = request.body;
    const user = await users.findOne({ email: email });
    if (user && user.password === password) {
        userId = user._id.toString();
        response.cookie('userId', userId);
        response.json({ status: 'success', user: user });
    }
    else {
        response.json({ status: 'error', message: 'Invalid username or password' });
    }
});

app.post("/register", async (request, response) => {
    console.log("register post request received")
    const { username, password, email } = request.body;
    const newUser = { username: username, password: password, email: email };
    await users.insertOne(newUser);
    const userData = await db.collection('userData').findOne({ userId: newUser._id });
    userId = newUser._id.toString();
    response.cookie('userId', userId);
    if (!userData) {
        response.json({ status: 'success', user: newUser, userData: userData });
    } else {
        response.json({ status: 'error', message: 'Account already exists' });
    }
});

const uuid = require('uuid');
let uploadedImage;
app.post("/upload", upload.single('image'), async (request, response) => {
       console.log(request.file.path);
    const tempPath = request.file.path;
    const targetPath = path.join(__dirname, "./uploads/uploadedImage.jpg");
    fs.rename(tempPath, targetPath, async err => 
 {
        if (err) {
            console.log("error")
        }
        else {
            console.log("uploaded")
            //console.log(targetPath);
        uploadedImage = targetPath;
      
    }})
})


app.get('/retrieveImages', async (request, response) => {
    const userId = request.cookies.userId;

    const userImages = await images.find({ userId: userId }).toArray();
    response.set('Access-Control-Allow-Origin', '*');


    response.json(userImages);
});

const {Storage} = require('@google-cloud/storage');
const storage = new Storage();


app.get('/getImage/:imageId', async (request, response) => {
    const imageId = request.params.imageId;

    const bucket = storage.bucket('sharpify-2c8fc.appspot.com');
    const file = bucket.file(imageId);

    const readStream = file.createReadStream();

    readStream.on('error', (err) => {
        response.status(500).send(err);
    });

    response.set('Content-Type', 'image/jpeg');

    readStream.pipe(response);
});



app.post("/sharpify", upload.single('image'), async (request, response) => {
//FOR A NEW ENHANCE BUTTON
    console.log("sharpify post request received")
    // const uploadedImage = request.body.imagePath;
    console.log("image: " + uploadedImage)
console.log("image: " + uploadedImage.path)
    const form = new FormData();

    let file = fs.createReadStream(uploadedImage);

    form.append('image', file);
    
    //from api documentation
    form.append('enhancements', JSON.stringify(['denoise', 'deblur', 'light', 'clean']));
    form.append('width', 2000);
// Get the headers from the form
const formHeaders = form.getHeaders();

    //console.log("line 250 " + file)
    const apiUrl = 'https://deep-image.ai/rest_api/process_result';
    const headers = {
    'Content-Type': formHeaders['content-type'],
    'X-API-Key': process.env.API_KEY,  // Replace 'API_KEY' with your actual API key
  };


  fetch(apiUrl, {
    method: 'POST',
    body: form,
    headers: headers,
  })
    .then(res => res.json())
    .then(data => {
      console.log('Response:', data);
      console.log(data.result_url); // Log the URL of the enhanced image  
      response.json(data);  // Send the data as a response
    })
    .catch(error => {
      console.error('Error:', error.message);
      response.status(500).send('An error occurred');
    });
}
)
//get reqeust to retrieeve the image

// Delete Image

// app.delete("/delete", async (request, response) => {
//     const {username, password} = request.body;


//     console.log("line 166 " + request.body.id)


//     const userData = await usersData.findOne({$and: [
//         { id: parseInt(request.body.id) },
//         { userId: request.cookies['userId'] }
//       ]});
//     console.log("line 174 " + JSON.stringify(userData, null, 2));
//     let objectId = userData._id

//     usersData.deleteOne({_id: objectId})


//     if (usersData.find({ _id: objectId }) === null) {
//         console.log("deleted")
//     }

//     console.log(namesArray)

//     response.writeHead(200, "OK", { "Content-Type": "application/json" })
//     response.end(JSON.stringify({ status: 'success', message: 'Delete' }))
// })

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

// app.listen(process.env.PORT || port)
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
  });
