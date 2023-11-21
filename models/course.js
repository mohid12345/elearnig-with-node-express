const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema ({
    courseName: {
        require : true,
        type: String,
    },
    courseDiscription:{
        require: true,
        type: String,
    },
    courseCategory:{
        require: true,
        type: String,
    },
    courseAuthor:{
        require: true,
        type: String,
    },
    courseAmount:{
        require: true,
        type: String,
    },
    courseDuration:{
        require: true,
        type: String,
    },
    courseLessonNos :{
        require: true,
        type: Number,
    },
    courseStatus:{
        require: true,
        type: String,
    },
    courseImg:{
        require: true,
        type: Array,
    },
});

const courseCollection = mongoose.model("courseCollection", courseSchema);
module.exports = courseCollection;

