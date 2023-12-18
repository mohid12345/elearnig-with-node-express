const express = require("express");
const adminRouter = express.Router();
const multer = require("multer")

const adminMiddleware = require("../middlewares/admin_authentication")
// const adminControllers = require("../controllers/admin_controllers/adm_login");
const loginControll = require("../controllers/admin_controllers/adm_login")
// const dashboardControll = require("../controllers/admin_controllers/adm_dashboard")
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

// adminRouter.use("/public/uploads",express.static('public/uploads'));
///////////old multer///////////////////////////////////////////////////////////////////////////////
// adminRouter.use("/uploads",express.static('uploads'));
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const uploads=multer({storage:storage}) 
////////////////////////////////////////////////////////////////////////////////////


adminRouter.use("/uploads",express.static('uploads'));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
// const limits = {
//   files: 5, // Maximum number of files for the 'courseImg' field
// };

const uploads = multer({
  storage: storage,
  // limits: limits,
}).array('courseImg', 5);
//  const uploads=multer({storage:storage}) 
// })



//login
adminRouter.get("/adminLogin",  loginControll.getAdminLogin)
//logout
adminRouter.get("/adminLogout", loginControll.getAdminLogout)
// adminRouter.get("/adminLogout", (req,res)=>{
//   console.log("hello")
// })

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


// adminRouter.post("/postadd-course", uploads.array("courseImg"), courseControll.postCourse)
adminRouter.post("/postadd-course", uploads, courseControll.postCourse)
adminRouter.post("/postadd-course-video", courseControll.postCourseVideo)



adminRouter.get("/delete-course/:courseId", courseControll.deleteCourse);
adminRouter.get("/edit-course/:courseId", courseControll.editCourse)
// adminRouter.post("/postEdit-course/:courseId", uploads, courseControll.updateCourse)
// adminRouter.post("/postEdit-course/:courseId", uploads.array("courseImg"), courseControll.updateCourse)



// Manage User
adminRouter.get("/admin-usermanage", usermanageControll.getUsers)
adminRouter.get("/block-user/:userId", usermanageControll.blockUser)
adminRouter.get("/unblock-user/:userId", usermanageControll.unblockUser)


//Manage Creator
adminRouter.get("/admin-creatormanage",creatormanageControll.getCreator)
adminRouter.get("/block-creator/:creatorId",creatormanageControll.blockCreator)
adminRouter.get("/unblock-creator/:creatorId",creatormanageControll.unblockCreator)

module.exports = adminRouter;


