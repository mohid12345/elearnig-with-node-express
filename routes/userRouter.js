const express = require("express");
const userRouter = express.Router(); //putting router to userRouter
const userControllers = require("../controllers/userControllers");
// userRouter.set("views","./views/user")
const path = require("path");
// userRouter.set("views", path.join(__dirname, "views","user"));


//redirecting each req to corresponding controllers
userRouter.get("/", userControllers.getUserRoute);
userRouter.post("/userLogin",userControllers.postLogin);
userRouter.get("/userDashboard", userControllers.getUserDashboard);
userRouter.get("/logout", userControllers.getUserLogout);


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
  

userRouter.route("/userSignup")
.get(userControllers.getUserSignup)
.post(userControllers.postUserSignup);
// userRouter.get("/userSignup", userControllers.getUserSignup)
// userRouter.post("/userSignup", userControllers.getUserSignup)


// userRouter.get('/user/signup', userControllers.getUserSignup);
// userRouter.get('/user-signup', userControllers.getUserSignup);
// userRouter.post('/user-signup', userControllers.postUserSignup);


module.exports = userRouter;

