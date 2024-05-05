// Package for configuring environment variables
// Restart of application is recommended to ensure that env variables are loaded properly
require('dotenv').config();
// Passport is an authentication middleware for Node.js. It can be added in to any Express-based web application. 
// A comprehensive set of strategies that support authentication using a username and password, Facebook, Twitter, and more.
const passport = require("passport");

// Imports the Google OAuth 2.0 authentication strategy for Passport
const GoogleStrategy = require("passport-google-oauth20").Strategy;

/*
	- Sets up a new instance of the Google authentication strategy, providing the client ID, client secret, callback URL, and a callback function
	- This configures Passport to use the Google OAuth 2.0 authentication strategy.
	- Uses the Google API Console project OAuth Client ID Credentials (e.g. clientID and clientSecret) to authorize the app to connect to the Google API.
	- The callback function is executed when a user is authenticated. It receives user profile information from Google, and done is a callback function used to indicate whether the authentication was successful or not
*/
// This configures Passport to use the Google OAuth 2.0 authentication strategy.
// Uses the Google API Console project OAuth Client ID Credentials (e.g. clientID and clientSecret) to authorize the app to connect to the Google API.
passport.use(new GoogleStrategy({
	clientID: process.env.clientID,
	clientSecret: process.env.clientSecret,
	callbackURL: "http://localhost:4000/users/google/callback",
	passReqToCallback: true
},
// This is the callback function that gets executed when a user is successfully authenticated.
function (request, accessToken, refreshToken, profile, done) {
	// The done parameter is a callback function provided by Passport to indicate the completion of the authentication process
	return done(null, profile)
}
));

// This function is used to serialize user object into the session
// The entire user object is serialized
// The serialized user object is then stored in the session.
passport.serializeUser(function(user, done) {
	done(null, user);
})

// This function is used to deserialize user object into the session
// It retrieves the serialized user object from the session as passes it to the "done" callback
passport.deserializeUser(function(user, done) {
	done(null, user);
})