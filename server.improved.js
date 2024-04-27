const express = require( 'express' ),
      cookie  = require( 'cookie-session' ),
      { MongoClient, ObjectId } = require("mongodb"),
      hbs     = require( 'express-handlebars' ).engine,
      app     = express()

// FOR GLITCH OR OTHER SERVER: 
 //const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
// FOR DEVELPOMENT:
const uri = `mongodb+srv://austinwebwareuser:austinwebwareuser@webwareclustera3.utwkatb.mongodb.net/`

const client = new MongoClient( uri )

let collectionScores = null
let collectionLogin = null
let currentUserLoggedIn = null

// Function to connect to both databases in mongo
async function run() {
  await client.connect()
  collectionScores = await client.db("webware").collection("scores")
  collectionLogin = await client.db("webware").collection("users")
}

run()

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )
//app.use( express.json() )

// we're going to use handlebars, but really all the template
// engines are equally painful. choose your own poison at:
// http://expressjs.com/en/guide/using-template-engines.html
app.engine( 'handlebars',  hbs() )
app.set(    'view engine', 'handlebars' )
app.set(    'views',       './views' )

app.use( express.static( 'public' ) )


// cookie middleware! The keys are used for encryption and should be changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.post( '/login', async (req,res)=> {
  debugger
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  
  const user = { username: req.body.username}
  const dbResult = await collectionLogin.findOne(user)

  if( dbResult === null) {

    collectionLogin.insertOne(req.body)
    req.session.login = true
    currentUserLoggedIn = req.body.username
    res.redirect( 'main.html' )

  } else {

    if(dbResult.password === req.body.password){

      req.session.login = true
      if(req.body.username !== '') {
        currentUserLoggedIn = req.body.username
      } else {
        currentUserLoggedIn = 'Guest'
      }
      res.redirect( 'main.html' )
      
    } else {

      req.session.login = false
      res.render('index', { msg:'<div class="w-50 mx-auto bg-danger p-3 rounded text-center"><b class="my-auto">Your login failed! Please try again with a new username or a valid password.</b></div>', layout:false })

    }
  }
})



// Sends the user to the index page
app.get( '/', (req,res) => {
  res.render( 'index', { msg:'', layout:false })
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true && currentUserLoggedIn != null )
    next()
  else
    res.render('index', { msg:'<div class="w-50 mx-auto bg-danger p-3 rounded text-center"><b class="my-auto">Your login failed! Please try again with a new username or a valid password.</b></div>', layout:false })
})

// middleware that checks if the database connection was successful
app.use( (req,res,next) => {
  if( collectionScores !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

// Route for the index page
app.get( '/index.html', ( req, res) => {

  res.render( 'index', { msg:'', layout:false })

})

// Route for the main page
app.get( '/main.html', ( req, res) => {

  res.render( 'main', { msg:'Success! You have logged in '+currentUserLoggedIn+"!", layout:false })

})

// Route for the scores page
app.get( '/scores.html', ( req, res) => {

  res.render( 'scores', { msg:'Currently Logged In: '+currentUserLoggedIn, layout:false })

})

// Route for the API that returns a list of scores
app.get( '/getScores', async (req, res) => {

  const docs = await collectionScores.find({}).sort({score:-1}).limit(10).toArray();

  res.end( JSON.stringify(docs) )

})

// Route for the API that returns a user's highest score ranking
app.get( '/getPersonal', async (req, res) => {

  const docs = await collectionScores.find({}).sort({score:-1}).toArray();
  let count = 0;
  let ranking = {}
  for(item in docs){
    count++;
    if(docs[item].username == currentUserLoggedIn){
      ranking = {ranking: count, username: docs[item].username, score: docs[item].score}
      break
    }
  }
  res.end( JSON.stringify(ranking) )

})

app.get('/getHighScore', async (req, res) =>{

  const score = await collectionScores.find({username: currentUserLoggedIn}).sort({score:-1}).limit(1).toArray();
  res.end(JSON.stringify(score))

})

// Route that submits a score to the database
app.post( '/submitScore', (req, res) => {
  let dataString = ""

  req.on( "data", function( data ) {
      dataString += data 
  })

  req.on( "end", async function() {
    // ... do something with the data here!!!
    let url = req.url;
    let data = JSON.parse( dataString )


    record = {username: currentUserLoggedIn, score: data.score };
    const result = await collectionScores.insertOne( record )

    res.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    res.end()
  })
})

app.listen( process.env.PORT || 3000 )

