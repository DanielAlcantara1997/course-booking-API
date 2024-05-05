const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Course Name is required"]
    },
    description: {
        type: String,
        required: [true, "Course Description is required"]
    },
    price: {
        type: Number,
        required: [true, "Course Price is required"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Course", courseSchema);