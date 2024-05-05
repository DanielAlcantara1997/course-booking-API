require('dotenv').config()
const jwt = require("jsonwebtoken");

// The secret key is usually used by JWT to determine that a token was generated from the same application.
const secret = process.env.SECRET;

// [SECTION] JSON Web Tokens
/*
    - JSON Web Token or JWT is a way of securely passing information from the server to the client or to other parts of a server
    - Information is kept secure through the use of the secret code
    - Only the system that knows the secret code can decode the encrypted information
    - Imagine JWT as a gift wrapping service that secures the gift with a lock
    - Only the person who knows the secret code can open the lock
    - And if the wrapper has been tampered with, JWT also recognizes this and disregards the gift
    - This ensures that the data is secure from the sender to the receiver
*/

//[Section] Token Creation
/*
Analogy:
    Pack the gift and provide a lock with the secret code as the key
*/

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	// The sign() function is responsible for creating a token using the user data, secret key, and options/modifiers for the token (which is represented by the empty object).
	return jwt.sign(data, secret, {});
}

// Token verification

module.exports.verify = (req, res, next) => {
	console.log(req.headers.authorization);

	let token = req.headers.authorization;
	// console.log("This is the token", token)

	if(typeof token === "undefined") {
		return res.send({auth: "Failed. No Token."})
	} else {

		console.log(token);
		token = token.slice(7, token.length);
		console.log(token);

		// Token decryption
		jwt.verify(token, secret, function(err, decodedToken) {

			if(err) {
				return res.send({
					auth: "Failed",
					message: err.message
				})
			} else {
				console.log("Result from verify method:")
				console.log(decodedToken);

				req.user = decodedToken;
				// console.log("This is the req.user:" + req.user);

				next();
			}
		})
	}
}


module.exports.verifyAdmin = (req, res, next) => {
	console.log("Result from verifyAdmin method:");
	console.log(req.user)

	// Checks if the owner of the token is an admin
	if(req.user.isAdmin) {
		// move to the next middleware
		next();

	// If not admin, send the status and message
	} else {
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}

// Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
	if(req.user){
		next();
	}  else {
		res.sendStatus(401);
	}
}