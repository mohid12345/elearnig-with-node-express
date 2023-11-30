const express = require("express");
const userRouter = express.Router(); 
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
userRouter.use(cookieParser())


const userMiddleware =  require("../user-middleware/user_authentication")
const userControllers = require("../controllers/user_controllers/userControllers");
const otpVerification = require("../controllers/user_controllers/otpVerification");
const homepageControll = require("../controllers/user_controllers/homepage")
const loginControll = require("../controllers/user_controllers/login")
const courseControll = require("../controllers/user_controllers/coursedetails")
const path = require("path");


userRouter.use("/uploads",express.static('uploads'));

//homepage routes
userRouter.get("/", homepageControll.getUserRoute);
userRouter.get("/userLogout", homepageControll.getLogout);


//userlogin
userRouter.post("/userLogin",loginControll.postLogin);
userRouter.get("/userForgetPwd",loginControll.getForgetPwd)
// userRouter.post("/userOtpLogin",userControllers.postOtpLogin);
// userRouter.get("/userDashboard", userControllers.getUserDashboard);



// userRouter.get("/send_otp", otpVerification.getSendOtp);
// userRouter.post("/verify_otp", otpVerification.postVerifyOtp);
userRouter.get("/send-otp", otpVerification.getSendOtp);
userRouter.post("/verify-otp", otpVerification.postVerifyOtp);


//forgetpasswordRoutes
// userRouter.get("/forget-send-otp", otpVerification.getSendOtp);
// userRouter.post("/forget-verify-otp", otpVerification.postVerifyOtp);

userRouter.route("/userSignup")
.get(userControllers.getUserSignup)
.post(userControllers.postUserSignup);

userRouter.get("/course-details/:courseId", userMiddleware.verifyUser, courseControll.courseDetails)




//local page rendering
userRouter.get("/about", (req, res) => {
    // Render the about page
    res.render("about");
  });
userRouter.get("/courses", homepageControll.getUserRoute_Course)

userRouter.get("/contact", (req, res) => {
    // Render the contact page
    res.render("contact");
  });
userRouter.get("/userLogin", (req, res) => {
    // Render the contact page
    res.render("userLogin");
  });

module.exports = userRouter;

