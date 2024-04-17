const express = require( 'express' ),
      app = express(),
      path = require('path')

require('dotenv').config()

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())



app.listen( process.env.PORT || 3000 )