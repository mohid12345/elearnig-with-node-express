const express = require("express");
const adminRouter = express.Router(); //putting router to userRouter
const adminControllers = require("../controllers/adminControllers");

const path = require("path");


//redirecting each req to corresponding controllers
// adminRouter.get("/admin", adminControllers.getAdminRoute);


// adminRouter.post("admin/adminLogin",adminControllers.postAdminRoute);
adminRouter.route("/adminLogin")
  .get(adminControllers.getAdminRoute)
  .post(adminControllers.postAdminRoute);




// adminRouter.post("/adminLogin",(req, res)=>{
//   res.render("adminLogin");
// });

// adminRouter.post("/admin", (req, res) => {
//   // Render the about page
//   res.redirect("adminLogin");
// });

// adminRouter.post("/admin",adminControllers.postAdminLogin);
adminRouter.get("/adminDashboard", adminControllers.getAdminDashboard);
adminRouter.get("/adminLogout", adminControllers.getAdminLogout);
adminRouter.get("/admin/admin-usermanage",adminControllers.getUserManage);
adminRouter.get("/admin/admin-creatormanage",adminControllers.getCreatorManage);


// adminRouter.get("/user-login", (req, res) => {
//     // Render the contact page
//     res.render("userLogin");
//   });
  

module.exports = adminRouter;


