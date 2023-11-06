const express = require("express");
const adminRouter = express.Router(); //putting router to userRouter
const adminControllers = require("../controllers/adminControllers");
// adminRouter.set("views","./views/admin");

const path = require("path");


//redirecting each req to corresponding controllers
adminRouter.get("/", adminControllers.getAdminRoute);


// userRouter.post("/login",userControllers.postLogin);
adminRouter.post("/adminLogin",(req, res)=>{
  res.render("adminLogin");
});

// adminRouter.post("/admin", (req, res) => {
//   // Render the about page
//   res.redirect("adminLogin");
// });

// adminRouter.post("/admin",adminControllers.postAdminLogin);
adminRouter.get("/adminDashboard", adminControllers.getAdminDashboard);
adminRouter.get("/adminLogout", adminControllers.getAdminLogout);


// adminRouter.get("/user-login", (req, res) => {
//     // Render the contact page
//     res.render("userLogin");
//   });
  

module.exports = adminRouter;


