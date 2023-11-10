const express = require("express");
const userRouter = express.Router(); 
const userControllers = require("../controllers/userControllers");
const path = require("path");

//redirecting each req to corresponding controllers
userRouter.get("/", userControllers.getUserRoute);
userRouter.post("/userLogin",userControllers.postLogin);
// userRouter.post("/userOtpLogin",userControllers.postOtpLogin);
userRouter.get("/userDashboard", userControllers.getUserDashboard);
userRouter.get("/userlogout", userControllers.getUserLogout);


// userRouter.get("/send-otp", userControllers.getSendOtp);
// userRouter.post("/verify-otp", userControllers.postVerifyOtp);
userRouter.get("/send-otp", userControllers.sendOTP);
userRouter.post("/verify-otp", userControllers.verifyOTP);

userRouter.route("/userSignup")
.get(userControllers.getUserSignup)
.post(userControllers.postUserSignup);




//local page rendering
userRouter.get("/about", (req, res) => {
    // Render the about page
    res.render("about");
  });
userRouter.get("/courses", (req, res) => {
    // Render the contact page
    res.render("courses");
  });
userRouter.get("/contact", (req, res) => {
    // Render the contact page
    res.render("contact");
  });
userRouter.get("/userLogin", (req, res) => {
    // Render the contact page
    res.render("userLogin");
  });

module.exports = userRouter;

