require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Google Login
const passport = require("passport");
const session = require("express-session");
require('./passport');

// Allows access to routes defined within our application
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");

const app = express();

// Google Login
// Creates a session with the given data
// resave prevents the session from overwriting the secret while the session is active. It controls whether the session should be saved to the session store on every request, even if the session data hasn't changed.
// saveUninitialized prevents creating sessions for users that haven't been authenticated
app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false
}))

// Initializes the passport package when the application runs
app.use(passport.initialize());
// Creates a session using the passport package
app.use(passport.session());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// Groups all routes in userRoutes under "/users" and courseRoutes under "/courses"
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);


if(require.main === module) {
	app.listen(process.env.PORT, () => {
		console.log(`API is now online on port ${ process.env.PORT}`);
	})
}

module.exports = {app, mongoose};