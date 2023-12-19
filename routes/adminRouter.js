const express = require("express");
const adminRouter = express.Router();
const multer = require("multer")
const cloudinaryUploadMiddleware = require('../middlewares/cloudinaryUploadMiddleware')

const adminMiddleware = require("../middlewares/admin_authentication")
const loginControll = require("../controllers/admin_controllers/adm_login")
const categoryControll = require("../controllers/admin_controllers/adm_category")
const courseControll = require("../controllers/admin_controllers/adm_course")
const usermanageControll = require("../controllers/admin_controllers/adm_usermanage")
const creatormanageControll = require("../controllers/admin_controllers/adm_creatormanage")

require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.API_CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY,
});
console.log(cloudinary.config().cloud_name);

//multer setup
adminRouter.use("/uploads",express.static('uploads'));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploads = multer({
  storage: storage,
}).array('courseImg', 5);


//login
adminRouter.get("/adminLogin",  loginControll.getAdminLogin)
//logout
adminRouter.get("/adminLogout", loginControll.getAdminLogout)

// homepage
adminRouter.post("/adminDashboard", loginControll.postAdminDashboard)
adminRouter.get("/adminDashboard", loginControll.getAdminDashboard)
// adminRouter.get("/adminDashboard", adminMiddleware.verifyAdmin,  loginControll.getAdminDashboard)

// Category
adminRouter.get("/category-list", categoryControll.getCategory)
adminRouter.post("/add-category", categoryControll.postCategory)
adminRouter.get("/edit-category/:categoryId", categoryControll.editCategory)
adminRouter.post("/postEdit-category/:categoryId", categoryControll.updateCategory)
adminRouter.get("/delete-category/:categoryId", categoryControll.deleteCategory)

//Courses
adminRouter.get("/course-list", courseControll.getCourseList)
adminRouter.get("/add-course", courseControll.getAddCourse)

//Coures add & update
adminRouter.post("/postadd-course", uploads, courseControll.postCourse)
adminRouter.post("/postadd-course-video", cloudinaryUploadMiddleware('courseVid'), courseControll.postCourseVideo)

adminRouter.get("/delete-course/:courseId", courseControll.deleteCourse);
adminRouter.get("/edit-course/:courseId",courseControll.editCourse)

// Manage User
adminRouter.get("/admin-usermanage", usermanageControll.getUsers)
adminRouter.get("/block-user/:userId", usermanageControll.blockUser)
adminRouter.get("/unblock-user/:userId", usermanageControll.unblockUser)

//Manage Creator
adminRouter.get("/admin-creatormanage",creatormanageControll.getCreator)
adminRouter.get("/block-creator/:creatorId",creatormanageControll.blockCreator)
adminRouter.get("/unblock-creator/:creatorId",creatormanageControll.unblockCreator)

module.exports = adminRouter;


