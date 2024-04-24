const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const corsMiddleware = require("./config/corsConfig");

dotenv.config(); // allow for .env
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
); // allow for sessions

// database setup
require("./config/database");

// passport setup
require("./config/passport-setup");
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(corsMiddleware);

app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the home route" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});