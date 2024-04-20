const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
dotenv.config();
const bcrypt = require('bcryptjs');

/*
const bcrypt = require(‘bcryptjs’);
// User registration
const register = async (req, res) => {
 const { name, email, password } = req.body;
 const salt = await bcrypt.genSalt(10);
 const hashedPassword = await bcrypt.hash(password, salt);
 const tempObj = { name, email, password: hashedPassword };
// Store the user object in the database
 // …
res.status(201).json({ message: 'Registration successful' });
}; */

exports.genHashSalt = async function (body) {
    const password = body.password;
    const salt = await bcrypt.genSalt(10);
    if(password === null) return false;
    const hashedPW = await bcrypt.hash(password, salt);
    return hashedPW;

}
async function testHashSalt() {
    const hashedPassword = await genHashSalt({ password: "farts" });
    console.log(hashedPassword);
}

testHashSalt().catch(console.error);
exports.generateAccessToken = function(username){
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

exports.authenticateToken = function(req, res, next){
  console.log(req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)
    if(err) return res.sendStatus(403)
    req.user = user;
    console.log(user)
    next()
  })
}
