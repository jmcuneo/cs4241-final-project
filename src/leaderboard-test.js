const db = require("./db");
const date =  new Date(Date.now());
const datetime = date.toUTCString(); 


db.addLeaderboardEntry({
    "username": "ivy",
    "score": 10000
    
});
