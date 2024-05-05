const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const auth = require('../auth');
const bcrypt = require("bcrypt");

// Check if email already exists
module.exports.checkEmailExists = (req, res) => {


	if(req.body.email.includes("@")){
		return User.find({email: req.body.email})
		.then(result => {
	        if (result.length > 0) {
	            // If there is a duplicate email, send true with 409 http status back to the client
	            return res.status(409).send({ error: "Duplicate Email Found" });
	        } else {
	            // If there is no duplicate email, send false with 404 http status back to the client
	            return res.status(404).send({ message: "Email not found" });
	        };
	    })
	    // if an error occured in the .catch(), send the error with the 500 http status back to the client
	    .catch(err => {
            console.error("Error in find", err)
            return res.status(500).send({ error: "Error in find"});
        })
	} else {
		 return res.status(400).send({ error: "Invalid Email"});
	}

	// The result is sent back to the client via the .then method
	

	/*.then(result => {
		// The find method returns a record if a match is founf
		if(result.length > 0) {
			return res.send(true);

		// No duplicate found
			// The user is not yet registered in the database
		} else {
			return res.send(false);
		}
	})
	.catch(err => res.send(err));*/

}

//409 is the status code for duplicate records
//404 is the status code for not found
//500 internal server error

/*
	Mini-A Instructions:

		Update the checkEmailExists to add status codes
		- if there is a duplicate email, send true with 409 http status code back to the client
		- if there is no duplicate email, send false with 404 http status code back to the client
		- if there is an error occured in the .catch(), send the error with the 500 http status back to the client


*/





// Register new user into database
/*
    Steps:
    1. Create a new User object using the mongoose model and the information from the request body
    2. Make sure that the password is encrypted
    3. Save the new User to the database
*/
module.exports.registerUser = (req, res) => {

	// Checks if the email is in the right format
    if (!req.body.email.includes("@")){
        return res.status(400).send({ error: "Email invalid" });
    }
    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ error: "Mobile number invalid" });
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({ error: "Password must be atleast 8 characters" });
    // If all needed requirements are achieved
    } else {
    	// 1. Creating a new instance of the User model
    	let newUser = new User({
    		firstName: req.body.firstName,
    		lastName: req.body.lastName,
    		email: req.body.email,
    		mobileNo: req.body.mobileNo,
    		password: bcrypt.hashSync(req.body.password, 10)
    	})

    	// 2. Save the new user data into the database by using the 'save()' function which comes from the usage of mongoose npm package
    	return newUser.save()
    	.then((result) => res.status(201).send({ message: "Registered Successfully" }))
    	// catch the error and return to the handler function. No return keyword used because we're using arrow function's implicit return feature
    	.catch(err => {
    		console.error("Error in saving: ", err)
            return res.status(500).send({ error: "Error in save"})		            
    	});
    }

}

// Login an existing user
/*
    Steps:
    1. Check the database if the user email exists
    2. Compare the password provided in the login form with the password stored in the database
    3. Generate/return a JSON web token if the user is successfully logged in and return false if not
*/
module.exports.loginUser = (req, res) => {


	if(req.body.email.includes("@")){

		return User.findOne({email: req.body.email})

		.then(result => {

			// If the user doesn't exist, then return false
			if(result == null){

				return res.status(404).send({ error: "No Email Found" });

			} else {
				// Compares the existing password to the password from postman (returns either true or false).
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				// Checks if password matches, if it does then return a newly generated access token. If not, just return false.
				// Uses the "createAccessToken" method defined in the "auth.js" file
				if(isPasswordCorrect){
					return res.status(200).send({accessToken: auth.createAccessToken(result)});
				} else {
					return res.status(401).send({ message: "Email and password do not match" });
				}
			}
		}).catch(err => {
			console.error("Error in find: ", err)
            return res.status(500).send({ error: "Error in find"})
		});
	}else{
		return res.status(400).send({error: "Invalid Email"})
	}



	// First looks for an existing user based on the email provided
	
}

/*
	Mini-A Instructions:
	Update the loginUser to add status codes
	- if the email is not found in the db, return 404 http status code
	- upon successful login and creation of the access token, send 200 http status code
	- if the email and password does not match, send 401 http status code
	- if there are errors in logging in, send 500 http status code


*/


//Retrieve user details
/*
    Steps:
    1. Retrieve the user document using it's id
    2. Change the password to an empty string to hide the password
    3. Return the updated user record
*/
module.exports.getProfile = (req, res) => {
	const userId = req.user.id;

    return User.findById(userId)
    .then(user => {
    	if (!user) {
    	    return res.status(404).send({ error: 'User not found' });
    	}

        user.password = "";
        return res.status(200).send({ user });
    })
    .catch(err => {
    	console.error("Error in fetching user profile", err)
        return res.status(500).send({ error: 'Failed to fetch user profile' })
    });
};

//The status code of a response is a 3-digit integer that describes the result of the req and the semantics of res


//[Enroll a user to a course]
/*
*/

module.exports.enroll = (req, res) => {

	console.log(req.user.id);
	console.log(req.body.enrolledCourses);

	if(req.user.isAdmin){
		return res.status(403).send({ error: "Admin is forbidden" });
		// 403 means unauthorized access
	}

	let newEnrollment = new Enrollment ({

		userId: req.user.id,
		enrolledCourses: req.body.enrolledCourses,
		totalPrice: req.body.totalPrice
	})

	return newEnrollment.save()
	.then(enrolled => {
		return res.status(201).send({
			message: "Successfully Enrolled",
			enrolled: enrolled			
		})
	})
	.catch(err => {
		console.error("Error in enrolling: ", err)
		return res.status(500).send({ error: "Error in enrolling" })
	});

}

module.exports.getEnrollments = (req, res) => {
    return Enrollment.find({userId : req.user.id})
        .then(enrollments => {
            if (enrollments.length > 0) {
                return res.status(200).send({enrollments});
            }
            return res.status(404).send({ error: 'No enrollments not found' });
        })
        .catch(err => {
        	console.error("Error in fetching enrollments")
        	return res.status(500).send({ error: 'Failed to fetch enrollments' })
        });
};


// Function to reset the password
module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller function to update the user profile
module.exports.updateProfile = async (req, res) => {
  try {
    // Get the user ID from the authenticated token
    const userId = req.user.id;

    // Retrieve the updated profile information from the request body
    const { firstName, lastName, mobileNo } = req.body;

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNo },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}


module.exports.setAsAdmin = (req, res) => {

    let updateAdminField = {
        isAdmin: true
    }
    
    return User.findByIdAndUpdate(req.body.userId, updateAdminField)
    .then(updateAdmin => {
        if (!updateAdmin) {
            return res.status(404).send({ error: 'User not found' });
        }
        
        const updatedAdmin = updateAdmin;

        return res.status(200).send({ 
            message: 'User admin status updated successfully', 
            updatedAdmin: updatedAdmin
        });
    })
    .catch(err => {
        console.error("Error in updating admin status: ", err)
        return res.status(500).send({ error: 'Failed to updating admin status' })
    });
};