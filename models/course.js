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
        type: Number,
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
    courseRequirements:{     //large points wabout course
        require: true,
        type: String,
    },
    courseForwho:{  //this course includes listed points
        require: true,
        type: String,
    },
    courseImg:{
        require: true,
        type: Array,
    },
    courseVid:{
        // filename: String,
        // mimeType: String,
        // size: Number,
        require: true,
        type: Array,
    },
});

const courseCollection = mongoose.model("courseCollection", courseSchema);
module.exports = courseCollection;

