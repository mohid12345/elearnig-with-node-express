const express = require("express");
const creatorRouter = express.Router(); 
const creatorControllers = require("../controllers/creator_controllers/creatorControllers");
const creatorUploadControl = require("../controllers/creator_controllers/creatorUploads")
const courseControll = require("../controllers/creator_controllers/creator_courses")
const path = require("path");
const multer = require("multer")



creatorRouter.use("/uploads",express.static('uploads'));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const limits = {
  files: 5, // Maximum number of files for the 'courseImg' field
};

const uploads = multer({
  storage: storage,
  limits: limits,
}).array('courseImg', 5);
// const uploads=multer({storage:storage}) 


creatorRouter.get("/creatorLogin", creatorControllers.getCreatorLogin)
creatorRouter.post("/creatorDashboard", creatorControllers.postCreatorLogin)
creatorRouter.get("/creatorDashboard", creatorControllers.getCreatorDash)
creatorRouter.get("/creatorUpload",creatorUploadControl.getCreatorUpload)
creatorRouter.route("/creatorSignup")
.get(creatorControllers.getCreatorSignup)
.post(creatorControllers.postCreatorSignup)
creatorRouter.get("/creatorLogout", creatorControllers.creatorLogout)



//Courses
creatorRouter.get("/course-list", courseControll.getCourseList)
creatorRouter.get("/add-course", courseControll.getAddCourse)
// creatorRouter.post("/postadd-course", uploads.array("courseImg"), courseControll.postCourse)
creatorRouter.post("/postadd-course", uploads, courseControll.postCourse)
creatorRouter.get("/delete-course/:courseId", courseControll.deleteCourse);
creatorRouter.get("/edit-course/:courseId", courseControll.editCourse)
creatorRouter.post("/postEdit-course/:courseId", uploads, courseControll.updateCourse)
// creatorRouter.post("/postEdit-course/:courseId", uploads.array("courseImg"), courseControll.updateCourse)

module.exports = creatorRouter;

