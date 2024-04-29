require("dotenv").config();
const fs = require('fs');
const express = require("express"),
    app = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    multer = require('multer'),
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

const uri = `mongodb+srv://dovushman:${process.env.PASSWORD}@cluster0.vpfjttx.mongodb.net/a3-dovUshman?retryWrites=true&w=majority&appName=Cluster0`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const upload = multer({ dest: 'uploads/' });


app.use(express.static(path.join(__dirname, 'build')));


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

        images = db.collection("images");
        console.log(`Connected to the collection:${images.collectionName}`);

    } catch (error) {
        console.dir(error);
    }
}
run();

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
        const result = await db.collection('images').insertOne(imageDocument);

        response.json({ message: 'File uploaded successfully', id: result.insertedId });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error uploading file' });
    }
    try {
        const result = await db.collection('images').insertOne(imageDocument);

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

app.post("/upload", upload.single('image'), async (request, response) => {
    console.log(request.file.path);
    const tempPath = request.file.path;
    const ext = path.extname(request.file.originalname);
    const targetPath = path.join(__dirname, `./uploads/uploadedImage${ext}`);
    fs.rename(tempPath, targetPath, async err => {
        if (err) {
            console.log("error")
        }
        else {
            console.log("uploaded")
            uploadedImage = targetPath;
        }
    })
})

app.get('/retrieveImages', async (request, response) => {
    const userId = request.cookies.userId;

    const userImages = await images.find({ userId: userId }).toArray();

    const imageUrls = userImages.map(image => image.firebaseUrl);

    response.set('Access-Control-Allow-Origin', '*');
    response.json(imageUrls);
});

const { Storage } = require('@google-cloud/storage');
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



async function waitForJobCompletion(apiUrl, headers, jobId) {
    let jobStatus = 'not_started';
    let resultUrl;

    while (jobStatus !== 'completed') {
        const response = await fetch(`${apiUrl}/${jobId}`, { headers });
        const data = await response.json();

        jobStatus = data.status;
        resultUrl = data.result_url;

        if (jobStatus !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return resultUrl;
}
app.post("/sharpify", upload.single('image'), async (request, response) => {
    console.log("sharpify post request received")
    const uploadedImage = request.file.path;
    console.log("image: " + uploadedImage)
    const form = new FormData();

    if (fs.existsSync(uploadedImage)) {
        let file = fs.createReadStream(uploadedImage);
        form.append('image', file);
    } else {
        console.log('File does not exist');
        response.status(500).send('File does not exist');
        return;
    }

    form.append('enhancements', JSON.stringify(['denoise', 'deblur', 'color', 'light']));
    form.append('denoise_parameters', JSON.stringify({ "type": "v2" }));
    form.append('deblur_parameters', JSON.stringify({ "type": "v2" }));
    form.append('color_parameters', JSON.stringify({ "type": "hdr_light_advanced", "level": 1 }));
    form.append('light_parameters', JSON.stringify({ "type": "hdr_light_advanced", "level": 1 }));
    form.append('width', 2000);
    form.append('quality', 100);

    const formHeaders = form.getHeaders();

    const apiUrl = 'https://deep-image.ai/rest_api/process_result';
    const headers = {
        'Content-Type': formHeaders['content-type'],
        'X-API-Key': process.env.API_KEY,
    };

    fetch(apiUrl, {
        method: 'POST',
        body: form,
        headers: headers,
    })
        .then(res => res.json())
        .then(async data => {
            console.log('Response:', data);

            if (data.status === 'not_started') {
                data.result_url = await waitForJobCompletion(apiUrl, headers, data.job);
            }

            console.log(data.result_url); 

            const downloadResponse = await fetch(data.result_url);
            const buffer = await downloadResponse.buffer();

            const imageId = uuid.v4();
            const firebaseUrl = await uploadImageToDbs(buffer, imageId, request);

            data.result_url = firebaseUrl; 
            response.json(data);  
        })
        .catch(error => {
            console.error('Error:', error.message);
            response.status(500).send('An error occurred');
        })
});

async function uploadImageToDbs(buffer, imageId, request) {
    const ext = path.extname(request.file.originalname);
    let contentType;
    if (ext === '.jpg' || ext === '.jpeg') {
        contentType = 'image/jpeg';
    } else if (ext === '.png') {
        contentType = 'image/png';
    }

    let firebaseUrl;
    try {
        const file = bucket.file(imageId);
        await file.save(buffer, {
            public: true,
            metadata: {
                contentType: contentType, 
                firebaseStorageDownloadTokens: uuid.v4()
            }
        });
        console.log(`Image uploaded to Firebase with ID: ${imageId}`);
        firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(imageId)}?alt=media`;
    } catch (error) {
        console.error('Error uploading image to Firebase:', error);
        return;
    }

    const imageDocument = {
        filename: imageId + ext, 
        firebaseUrl: firebaseUrl, 
        uploadDate: new Date(),
        userId: request.cookies.userId
    };
    try {
        const result = await images.insertOne(imageDocument);
        console.log(`Image uploaded to MongoDB with ID: ${result.insertedId}`);
    } catch (error) {
        console.error('Error uploading image to MongoDB:', error);
    }

    return firebaseUrl;
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.listen(process.env.PORT || port)
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});
