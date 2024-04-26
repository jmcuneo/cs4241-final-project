const { response } = require("express");
const db = require("./db");
const date =  new Date(Date.now());
const datetime = date.toUTCString(); 

/* db.run().then(()=>db.addLeaderboardEntry({
    "username": "ivy",
    "score": 10000
    
}).then(() => db.getLeaderboard())); */

let body = {
    username: "ibarts",
    password: "farts"
}
body = JSON.stringify(body)

const balls = async () => {
    const rsp = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          /* 'Authorization': `Bearer ${document.cookie.substring(6)}`, */
        },
        body
    
    })
    return rsp

}

console.log(balls());