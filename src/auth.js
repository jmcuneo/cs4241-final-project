const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const bcrypt = require("bcryptjs");

exports.genHashSalt = async function (body) {
    const password = body.password
    const saltRounds = 10;
  
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
    return hashedPassword;

};

exports.validatePasswordHash = async function (body , dbe) {
    const password = body.password;
    const hash = dbe.password;
    const correctPW = await new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function(err, hash) {
          if (err) reject(err)
          resolve(hash)
        });
      })
    return correctPW;       
}
exports.generateAccessToken = function (username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
};

exports.authenticateToken = function (req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log(user);
    next();
  });
};

exports.validateEmail = async  (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
