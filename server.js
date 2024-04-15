import express from 'express';
import vite from 'vite-express';

//import database from './database.js';
//import path from 'path';

//console.log('path: '+path.resolve())

const
  app = express(),
  port = 3000;
  //CALLBACK_DOMAIN = "https://game.gamestream.stream";
//CALLBACK_DOMAIN = "http://localhost:3000";

// setup database and sesions

//database.set_up_db_store(app);

// Run

// if (true) {
//   // run proxy
//   startProxy()
// }

vite.listen(app, process.env.PORT || port)
