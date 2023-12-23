const express = require("express");
const creatorRouter = express.Router(); 
const creatorControllers = require("../controllers/creator_controllers/creatorDashboard");
const creatorCourseController = require("../controllers/creator_controllers/creatorCourses")
const creatorLogin = require("../controllers/creator_controllers/creatorLogin")
const creatorSignup = require("../controllers/creator_controllers/creatorSignup")

const path = require("path");
const multer = require("multer");
const fileUpload = require("express-fileupload");
const cloudinaryUploadMiddleware = require("../middlewares/cloudinaryUploadMiddleware");

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
  files: 5,
};

const uploads = multer({
  storage: storage,
  limits: limits,
}).array('courseImg', 5);
// const uploads=multer({storage:storage}) 

//login
creatorRouter.get("/creatorLogin", creatorLogin.getCreatorLogin)
creatorRouter.post("/creatorDashboard", creatorLogin.postCreatorLogin)
creatorRouter.get("/creatorLogout", creatorLogin.creatorLogout)

//signup
creatorRouter.route("/creatorSignup")
.get(creatorSignup.getCreatorSignup)
.post(creatorSignup.postCreatorSignup)

//Dashboard
creatorRouter.get("/creatorDashboard", creatorControllers.getCreatorDash)

//Courses manage
creatorRouter.get("/creatorUpload",creatorCourseController.getCreatorUpload)
creatorRouter.get("/creator-course-list", creatorCourseController.getCourseList)
creatorRouter.get("creator-add-course", creatorCourseController.getAddCourse)
creatorRouter.post("/postadd-course", uploads, creatorCourseController.postCourse)
creatorRouter.post("/postadd-course-video",fileUpload(),cloudinaryUploadMiddleware('courseVid'),creatorCourseController.postCourseVideo)
creatorRouter.get("/delete-course/:courseId", creatorCourseController.deleteCourse);
creatorRouter.get("/edit-course/:courseId", creatorCourseController.editCourse)
creatorRouter.post("/postEdit-course/:courseId", uploads, creatorCourseController.updateCourse)

module.exports = creatorRouter;

