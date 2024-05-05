const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");

// Create a course
/*
    Steps: 
    1. Instantiate a new object using the Course model and the request body data
    2. Save the record in the database using the mongoose method "save"
    3. Use the "then" method to send a response back to the client appliction based on the result of the "save" method
*/
module.exports.addCourse = (req, res) => {

    // Creates a variable "newCourse" and instantiates a new "Course" object using the mongoose model
    // Uses the information from the request body to provide all the necessary information
    let newCourse = new Course({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    Course.findOne({name: req.body.name})
    .then(existingCourse => {
        if (existingCourse){
            return res.status(409).send({error: "Course already exists"})
        }
        return newCourse.save()
        .then(savedCourse => {
            return res.status(201).send({savedCourse})
        })
        .catch(saveErr => {
            console.error("Error in saving the course:", saveErr);
            return res.status(500).send({error: 'Failed to save the course'})
        });
    })
    .catch(findErr=>{
        console.error("Error in finding the course", findErr)
        return res.status(500).send({error: 'Error finding the course'})
    })

    // Saves the created object to our database
    

    // try {
    //     let newCourse = new Course({
    //         name : req.body.name,
    //         description : req.body.description,
    //         price : req.body.price
    //     });

    //     return newCourse.save()
    //     .then(result => res.send(result))
    //     .catch(err => res.send(err));
    // } catch (err) {
    //     console.log(err)
    //     res.send("Error in variables");
    // }
}; 


// Retrieve all courses
/*
    Steps: 
    1. Retrieve all courses using the mongoose "find" method
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getAllCourses = (req, res) => {

    return Course.find({})
    .then(courses => {
        if(courses.length > 0){
            return res.status(200).send({courses});
        } else {
            // 200 is a result of a successful request, even if the response returned no record/content
            return res.status(200).send({ message: 'No courses found.' });
        }
    })
    .catch(err => {
        console.error("Error in finding all courses: ", err)
        return res.status(500).send({error: "Error finding courses"})
    });
};

//Retrieve all active courses
/*
    Steps: 
    1. Retrieve all courses using the mongoose "find" method with the "isActive" field values equal to "true"
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getAllActive = (req, res) => {

    Course.find({ isActive: true })
    .then(courses => {
        
        if (courses.length > 0){
            return res.status(200).send({courses})
        }else{
            return res.status(200).send({message: "No active courses found."})
        }
    }).catch(err => {
        console.error("Error in finding active courses: ", err)
        return res.status(500).send({error: 'Error in finding active courses.'})
    });

};

//Retrieve a specific course
/*
    Steps: 
    1. Retrieve a course using the mongoose "findById" method
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getCourse = (req, res) => {
    const courseId = req.params.courseId;
    Course.findById(courseId)
    .then(course => {
       if (!course) {
           return res.status(404).send({ error: 'Course not found' });
       }
       return res.status(200).send({ course }); 
    })
    .catch(err =>{
        console.error("Error in fetching the course: ", err)
        return res.status(500).send({ error: 'Failed to fetch course' });
    });
    
};


// Updating a course
module.exports.updateCourse = (req, res) => {

    let updatedCourse = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Course.findByIdAndUpdate(req.params.courseId, updatedCourse, {new: true})
    .then(updatedCourse => {

        if(updatedCourse) {
            res.status(200).send({
                message: 'Course updated successfully',
                updatedCourse: updatedCourse   
            });
        } else {
            res.status(404).send({error: 'Course not found'})
        }
    })
    .catch(err => {
        console.error("Error in updating a course :", err)
        return res.status(500).send({error: 'Error in updating a course.'})
    });

}

//[S44 Activity]

//Archive a course
module.exports.archiveCourse = (req, res) => {

    let updateActiveField = {
        isActive: false
    }

    if (req.user.isAdmin == true){
        return Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
        .then(archiveCourse => {
            if (archiveCourse) {
                res.status(200).send({
                    message: 'Course archived successfully', 
                    archiveCourse: archiveCourse     
                });
            } else {
                res.status(400).send({ error: 'Course not found' });
            }
        })
        .catch(err => {
            console.error("Error in archiving a course: ", err)
            return res.status(500).send({ error: 'Failed to archive course' })
        });
    }
    else{
        return res.status(403).send(false);
    }
};

module.exports.activateCourse = (req, res) => {

    let updateActiveField = {
        isActive: true
    }
    
    if (req.user.isAdmin == true){
        return Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
        .then(activateCourse => {
            if (activateCourse) {
                res.status(200).send({
                    message: 'Course activated successfully', 
                    activateCourse: activateCourse
                });
            } else {
                res.status(400).send({error: "Course not found"});
            }
        })
        .catch(err => {
            console.error("Error in activating a course: ", err)
            return res.status(500).send({ error: 'Failed to activating a course' })
        });
    }
    else{
        return res.status(403).send(false);
    }
};


// Controller action to search for courses by course name
module.exports.searchCoursesByName = async (req, res) => {
  try {
    const { courseName } = req.body;

    // Use a regular expression to perform a case-insensitive search
    const courses = await Course.find({
      name: { $regex: courseName, $options: 'i' }
    });

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.getEmailsOfEnrolledUsers = async (req, res) => {
    const courseId = req.params.courseId; // Use req.params.courseId since it's in the route parameter

    try {
        // Find all enrollments for the given courseId
        const enrollments = await Enrollment.find({ 'enrolledCourses.courseId': courseId });

        if (!enrollments || enrollments.length === 0) {
            return res.status(404).json({ message: 'No users enrolled in this course' });
        }

        // Get the userIds of enrolled users for the specific course
        const userIds = enrollments.map(enrollment => enrollment.userId);

        // Find the users with matching userIds
        const enrolledUsers = await User.find({ _id: { $in: userIds } }); // Use userIds instead of undefined variable 'users'

        // Extract the emails from the enrolled users
        const emails = enrolledUsers.map(user => user.email); // Use map instead of forEach

        res.status(200).json({ userEmails: emails }); // Correct variable name userEmails, and include it in the response
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while retrieving enrolled users' });
    }
};


exports.searchCoursesByPriceRange = async (req, res) => {
    try {
      const { minPrice, maxPrice } = req.body;
  
      // Find courses within the price range
      const courses = await Course.find({
        price: { $gte: minPrice, $lte: maxPrice }
      });
  
      res.status(200).json({ courses });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching for courses' });
    }
  };