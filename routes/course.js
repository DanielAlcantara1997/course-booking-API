//Dependencies and Modules
const express = require("express");
const courseController = require("../controllers/course");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

//Routing Component
const router = express.Router();

//Route for creating a course
router.post("/", verify, verifyAdmin, courseController.addCourse);

//Route for retrieving all courses
router.get("/all", verify, verifyAdmin, courseController.getAllCourses);

//Route for retrieving all active courses
router.get("/", courseController.getAllActive);

//Route for retrieving a specific course
router.get("/:courseId", courseController.getCourse);

// Route for updating a course (ADMIN)
router.patch("/:courseId", verify, verifyAdmin, courseController.updateCourse);

//[S44 Activity]

// Route to archiving a course (Admin)
router.patch("/:courseId/archive", verify, verifyAdmin, courseController.archiveCourse);

//Route to activating a course (Admin)
router.patch("/:courseId/activate", verify, verifyAdmin, courseController.activateCourse);

// Route to search for courses by course name
router.post('/search', courseController.searchCoursesByName);

router.post('/:courseId/enrolled-users', courseController.getEmailsOfEnrolledUsers);

router.post('/searchByPrice', courseController.searchCoursesByPriceRange);

// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;
