const express = require("express");
const adminRouter = express.Router();
const multer = require("multer")
// const adminControllers = require("../controllers/admin_controllers/adm_login");
const loginControll = require("../controllers/admin_controllers/adm_login")
const dashboardControll = require("../controllers/admin_controllers/adm_dashboard")
const categoryControll = require("../controllers/admin_controllers/adm_category")
const courseControll = require("../controllers/admin_controllers/adm_course")
const usermanageControll = require("../controllers/admin_controllers/adm_usermanage")


const path = require("path");


adminRouter.use("/public/uploads",express.static('public/uploads'));
adminRouter.use("/uploads",express.static('uploads'));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploads=multer({storage:storage}) 



//login
adminRouter.get("/adminLogin", loginControll.getAdminLogin)

// homepage
adminRouter.post("/adminDashboard", loginControll.postAdminDashboard)
adminRouter.get("/adminDashboard", loginControll.getAdminDashboard)


// Category
adminRouter.get("/category-list", categoryControll.getCategory)
adminRouter.post("/add-category", categoryControll.postCategory)
adminRouter.get("/edit-category/:categoryId", categoryControll.editCategory)
adminRouter.post("/postEdit-category/:categoryId", categoryControll.updateCategory)
adminRouter.get("/delete-category/:categoryId", categoryControll.deleteCategory)

//Courses
adminRouter.get("/course-list", courseControll.getCourseList)
adminRouter.get("/add-course", courseControll.getAddCourse)
adminRouter.post("/postadd-course", uploads.array("courseImg"), courseControll.postCourse)
adminRouter.get("/delete-course/:courseId", courseControll.deleteCourse);
adminRouter.get("/edit-course/:courseId", courseControll.editCourse)
adminRouter.post("/postEdit-course/:courseId", uploads.array("courseImg"), courseControll.updateCourse)



// Manage User
adminRouter.get("/admin-usermanage", usermanageControll.getUsers)
adminRouter.get("/block-user/:userId", usermanageControll.blockUser)
adminRouter.get("/unblock-user/:userId", usermanageControll.unblockUser)

// adminRouter.get("/user-login", (req, res) => {
//     // Render the contact page
//     res.render("userLogin");
//   });
  

module.exports = adminRouter;


