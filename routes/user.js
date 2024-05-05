const express = require("express");
const passport = require('passport');
const userController = require("../controllers/user");
const { verify, isLoggedIn, verifyAdmin } = require("../auth");
const router = express.Router();

// Routes
// Route for checking if the user's email already exists in the database
router.post("/checkEmail", userController.checkEmailExists);

// Route for registering a new user into the database
router.post("/register", userController.registerUser);

// Route for logging in an existing user in the database
router.post("/login", userController.loginUser);

// Route for retrieving user details
// router.get("/details", verify, (req, res)=>{
// 	// console.log(req)
// 	// console.log("Result from the details route");
// 	// console.log(req.user);

//     userController.getProfile(req.user.id).then(resultFromController => res.send(resultFromController));
// });

router.get("/details", verify, userController.getProfile);

router.post('/enroll', verify, userController.enroll);

//Route to get the user's enrollements array
router.get('/getEnrollments', verify, userController.getEnrollments);


// Google Login
// Route for initiating the Google OAuth consent screen
router.get('/google', 
	passport.authenticate('google', {
		scope: ['email', 'profile'],
		// prompt: "select_account"
	})
)

// Route for callback URL for out Google OAuth authentication
router.get('/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/users/failed'
	}),
	function (req, res) {
		res.redirect('/users/success')
	}
)

// Route for failed authentication
router.get('/failed', (req, res) => {
	console.log("User is not authenticated.")
	res.send("Failed");
})

// Route for successful authentication
router.get('/success', isLoggedIn, (req, res) => {
	console.log("You are logged in");
	console.log(req.user);
	res.send(`Welcome ${req.user.displayName}`)
})


// Route for logging out
router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if(err) {
			console.log('Error while destroying session: ', err);
		} else {
			req.logout(() => {
				res.redirect('/');
			})
		}
	})
})


// Route for resetting the user password
router.post('/reset-password', verify, userController.resetPassword);

// Route for updating user profile
router.put('/profile', verify, userController.updateProfile);


router.patch("/updateAdmin", verify, verifyAdmin, userController.setAsAdmin);

module.exports = router;