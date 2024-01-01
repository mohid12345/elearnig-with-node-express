const express = require("express");
const adminRouter = express.Router();
const multer = require("multer")
const cloudinaryUploadMiddleware = require('../middlewares/cloudinaryUploadMiddleware')
const fileUpload = require('express-fileupload');

const adminMiddleware = require("../middlewares/admin_authentication")
const loginControll = require("../controllers/admin_controllers/adm_login")
const categoryControll = require("../controllers/admin_controllers/adm_category")
const courseControll = require("../controllers/admin_controllers/adm_course")
const usermanageControll = require("../controllers/admin_controllers/adm_usermanage")
const creatormanageControll = require("../controllers/admin_controllers/adm_creatormanage")
const ordermanageControll = require("../controllers/admin_controllers/adm_ordermanage")
const couponmanageControll = require("../controllers/admin_controllers/adm_couponmanage")


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
adminRouter.get("/category-list",adminMiddleware.verifyAdmin, categoryControll.getCategory)
adminRouter.post("/add-category",adminMiddleware.verifyAdmin, categoryControll.postCategory)
adminRouter.get("/edit-category/:categoryId",adminMiddleware.verifyAdmin, categoryControll.editCategory)
adminRouter.post("/postEdit-category/:categoryId",adminMiddleware.verifyAdmin, categoryControll.updateCategory)
adminRouter.get("/delete-category/:categoryId",adminMiddleware.verifyAdmin, categoryControll.deleteCategory)

//Courses
adminRouter.get("/course-list",adminMiddleware.verifyAdmin, courseControll.getCourseList)
adminRouter.get("/add-course",adminMiddleware.verifyAdmin, courseControll.getAddCourse)

//Coures add & update
adminRouter.post("/postadd-course",adminMiddleware.verifyAdmin, uploads, courseControll.postCourse)
adminRouter.post("/postadd-course-video",adminMiddleware.verifyAdmin,fileUpload(), cloudinaryUploadMiddleware('courseVid'), courseControll.postCourseVideo)
//we are using expresss fileUpload methos for uploading vidoe. and it cant be set with
// app.use( )  method globallly, then imgupload wont work

adminRouter.get("/delete-course/:courseId",adminMiddleware.verifyAdmin, courseControll.deleteCourse);
adminRouter.get("/edit-course/:courseId",adminMiddleware.verifyAdmin,courseControll.editCourse)

// Manage User
adminRouter.get("/admin-usermanage",adminMiddleware.verifyAdmin, usermanageControll.getUsers)
adminRouter.get("/block-user/:userId",adminMiddleware.verifyAdmin, usermanageControll.blockUser)
adminRouter.get("/unblock-user/:userId",adminMiddleware.verifyAdmin, usermanageControll.unblockUser)

//Manage Creator
adminRouter.get("/admin-creatormanage",adminMiddleware.verifyAdmin,creatormanageControll.getCreator)
adminRouter.get("/block-creator/:creatorId",adminMiddleware.verifyAdmin,creatormanageControll.blockCreator)
adminRouter.get("/unblock-creator/:creatorId",adminMiddleware.verifyAdmin,creatormanageControll.unblockCreator)

// manage order
adminRouter.get("/order-list",adminMiddleware.verifyAdmin, ordermanageControll.getOrderlist)
adminRouter.get("/order-manage/:orderId", adminMiddleware.verifyAdmin, ordermanageControll.getOrdermanage)
adminRouter.post("/dispatch-order", adminMiddleware.verifyAdmin, ordermanageControll.dispatchOrder)
adminRouter.post("/deliver-order", adminMiddleware.verifyAdmin, ordermanageControll.deliverOrder)
adminRouter.post("/cancel-order",adminMiddleware.verifyAdmin,  ordermanageControll.cancelOrder)
adminRouter.get("/sales-report",adminMiddleware.verifyAdmin, ordermanageControll.getSalesReport)
adminRouter.post("/filter-sales",adminMiddleware.verifyAdmin, ordermanageControll.filterSales)


// manage coupon
adminRouter.get("/coupon-list",adminMiddleware.verifyAdmin, couponmanageControll.getCouponlist)
adminRouter.get("/add-coupon",adminMiddleware.verifyAdmin, couponmanageControll.addCoupon)
adminRouter.post("/post-coupon",adminMiddleware.verifyAdmin, couponmanageControll.postCoupon)
adminRouter.get("/edit-coupon/:couponId",adminMiddleware.verifyAdmin, couponmanageControll.editCoupon)
adminRouter.post("/postEdit-coupon/:couponId",adminMiddleware.verifyAdmin, couponmanageControll.postEditcoupon)
adminRouter.get("/block-coupon/:couponId",adminMiddleware.verifyAdmin, couponmanageControll.blockCoupon)
adminRouter.get("/unblock-coupon/:couponId",adminMiddleware.verifyAdmin, couponmanageControll.unblockCoupon)


module.exports = adminRouter;


