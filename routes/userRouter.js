const express = require("express");
const userRouter = express.Router();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
userRouter.use(cookieParser());

const userMiddleware = require("../middlewares/user_authentication");
const userControllers = require("../controllers/user_controllers/userControllers");
const otpVerification = require("../controllers/user_controllers/otpVerification");
const homepageControll = require("../controllers/user_controllers/homepage");
const loginControll = require("../controllers/user_controllers/login");
const courseControll = require("../controllers/user_controllers/coursedetails");
const wishlistControl = require("../controllers/user_controllers/wishlistCntrol");
const cartControl = require("../controllers/user_controllers/cartController")
const accountControll = require("../controllers/user_controllers/account")
const path = require("path");

userRouter.use("/uploads", express.static("uploads"));

//homepage routes
userRouter.get("/", homepageControll.getUserRoute);
userRouter.get("/userLogout", homepageControll.getLogout);

//userlogin
userRouter.post("/userLogin", loginControll.postLogin);
userRouter.get("/userForgetPwd", loginControll.getForgetPwd);
// userRouter.post("/userOtpLogin",userControllers.postOtpLogin);
// userRouter.get("/userDashboard", userControllers.getUserDashboard);

userRouter.get("/send-otp", otpVerification.getSendOtp);
userRouter.post("/verify-otp", otpVerification.postVerifyOtp);

//forgetpasswordRoutes
// userRouter.get("/forget-send-otp", otpVerification.getSendOtp);
// userRouter.post("/forget-verify-otp", otpVerification.postVerifyOtp);

userRouter.route("/userSignup").get(userControllers.getUserSignup).post(userControllers.postUserSignup);

// userRouter.get("/course-details/:courseId", userMiddleware.verifyUser, courseControll.courseDetails)
userRouter.get("/course-details/:courseId", courseControll.courseDetails);

// Render the about page
userRouter.get("/about", homepageControll.getUserRoute_About);
// Router the course page
userRouter.get("/courses", homepageControll.getUserRoute_Course);
// Render the contact page
userRouter.get("/contact", homepageControll.getUserRoute_Contact);

// Render the contact page
userRouter.get("/userLogin", (req, res) => {
    res.render("userLogin");
});

//Rendering the wishlist page
userRouter.get("/userWishlist",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,wishlistControl.getWishlistPage);
userRouter.post("/addWishlist",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,wishlistControl.postWishlistPage);
userRouter.get("/delete-wishlist",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,wishlistControl.deleteWishlist);

//Renderign the cart page
userRouter.get("/userCart",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,cartControl.getCartPage);
userRouter.post("/addCart",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,cartControl.postCartPage);
userRouter.get("/delete-cart",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,cartControl.deleteCart);

//checkout 
userRouter.get("/userCheckout",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus, (req, res)=>{
    res.render("userCheckout");
})

//account
userRouter.get("/userAccount", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.getUserAccount)


module.exports = userRouter;
