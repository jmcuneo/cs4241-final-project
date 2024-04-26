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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });


app.use(express.static(path.join(__dirname, 'build')));

const { MongoClient, ObjectId } = require('mongodb');
const uri = `mongodb+srv://dovushman:${process.env.PASSWORD}@cluster0.vpfjttx.mongodb.net/a3-dovUshman?retryWrites=true&w=majority&appName=Cluster0`;

let db;
let users;
let usersData;

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

        usersData = db.collection("usersData");
        console.log(`Connected to the collection:${usersData.collectionName}`);

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
});

app.get("/data", async (request, response) => {
    const userId = request.query.userId;
    console.log("userId: ", userId);


    // Find the user in the users collection
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    console.log("user: ", user)

    let data = [];

    if (user) {
        
        data = await db.collection('usersData').find({ userId: user._id.toString() }).toArray();
        console.log("data: ", data)
        console.log("Made it into the if user")
        
        data.forEach(item => console.log("usersData.userId: ", item.userId));
    }

    response.writeHead(200, "OK", { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
});

let userId = "";


app.post("/signin", async (request, response) => {
    console.log("sign in post request received")
    const {email, password} = request.body;
    const user = await users.findOne({email: email});
    if (user && user.password === password) {
        userId = user._id.toString();
        response.cookie('userId', userId);
        response.json({status: 'success', user: user});
    }
    else {
        response.json({status: 'error', message: 'Invalid username or password' });
    }
});

app.post("/register", async (request, response) => {
    console.log("register post request received")
    const {username, password, email} = request.body;
    const newUser = {username: username, password: password, email: email};
    await users.insertOne(newUser);
    const userData = await db.collection('userData').findOne({userId: newUser._id});
    userId = newUser._id.toString();
    response.cookie('userId', userId);
    if (!userData) {
        response.json({status: 'success', user: newUser, userData: userData});
    } else {
        response.json({status: 'error', message: 'Account already exists'});
    }
});

//send the image


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

        //TENSORFLOW and POTRACE
      
    }})
})

app.post("/enhance", async (request, response) => {
//FOR A NEW ENHANCE BUTTON
    if(uploadedImage === undefined) {
} else{
    //
         const form = new FormData();
    form.append("upscale_factor", "x2");
    form.append("image_url","https://picsart.io/wp-content/uploads/2024/02/97ff2ec7-2f17-44a9-86a6-20d19db6ecd8.jpg");

    const options = {
      method: 'POST',
      host: 'api.picsart.io',
      path: '/tools/1.0/upscale',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
        'accept': 'application/json',
        'x-picsart-api-key': process.env.API_KEY
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(data);
        response.send(data);
      });
    });   
}
})
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