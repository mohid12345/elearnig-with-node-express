const express = require("express");
const creatorRouter = express.Router(); 
const creatorControllers = require("../controllers/creator_controllers/creatorDashboard");
const creatorCourseController = require("../controllers/creator_controllers/creatorCourses")
const creatorLogin = require("../controllers/creator_controllers/creatorLogin")
const creatorSignup = require("../controllers/creator_controllers/creatorSignup")

const cookieParser = require("cookie-parser");
creatorRouter.use(cookieParser());
const creatorMiddleware = require("../middlewares/creator_authentication");

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
creatorRouter.post("/postCreatorLogin", creatorLogin.postCreatorLogin)
creatorRouter.get("/creatorLogout",creatorMiddleware.verifyCreator,creatorMiddleware.checkBlockedStatus, creatorLogin.creatorLogout)

//signup
creatorRouter.route("/creatorSignup")
.get(creatorSignup.getCreatorSignup)
.post(creatorSignup.postCreatorSignup)

//Dashboard
creatorRouter.get("/creatorDashboard",creatorMiddleware.verifyCreator,creatorMiddleware.checkBlockedStatus, creatorControllers.getCreatorDash)

//Courses manage
creatorRouter.get("/creatorUpload",creatorMiddleware.verifyCreator,creatorMiddleware.checkBlockedStatus,creatorCourseController.getCreatorUpload)
creatorRouter.get("/creator-course-list",creatorMiddleware.verifyCreator,creatorMiddleware.checkBlockedStatus, creatorCourseController.getCourseList)
// creatorRouter.get("creator-add-course",creatorMiddleware.verifyCreator,creatorMiddleware.checkBlockedStatus, creatorCourseController.getAddCourse)
creatorRouter.post("/postadd-course",creatorMiddleware.verifyCreator,creatorMiddleware.checkBlockedStatus, uploads, creatorCourseController.postCourse)
creatorRouter.post("/postadd-course-video",creatorMiddleware.verifyCreator,creatorMiddleware.checkBlockedStatus,fileUpload(),cloudinaryUploadMiddleware('courseVid'),creatorCourseController.postCourseVideo)
creatorRouter.get("/delete-course/:courseId",creatorMiddleware.verifyCreator,creatorMiddleware.checkBlockedStatus, creatorCourseController.deleteCourse);
creatorRouter.get("/edit-course/:courseId",creatorMiddleware.verifyCreator,creatorMiddleware.checkBlockedStatus, creatorCourseController.editCourse)
creatorRouter.post("/postEdit-course/:courseId",creatorMiddleware.verifyCreator,creatorMiddleware.checkBlockedStatus, uploads, creatorCourseController.updateCourse)

module.exports = creatorRouter;

