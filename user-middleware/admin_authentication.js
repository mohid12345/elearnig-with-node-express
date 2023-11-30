const adminCollection = require("../models/adminSchema");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
require("dotenv").config();

module.exports.verifyAdmin = (req,res,next) => {
  const token = req.cookies.token;
  const verifyToken = jwt.verify(
    token, 
    process.env.JWT_SECRET_KEY,
    (err, decoded) => {
      if(err) {
        return res.redirect ("/");
      }
      req.admin = decoded;
      next(); //if success its passed to next callback route
    }
  )
};

// module.exports.checkAdminBlockedStatus = async (req,res,next) => {
//   try {
//     const userId = req.user;
//     const user = await userCollection.findById(userId);
//     if (user.status === "Block") {
//       res.clearCookie("token");
//       res.clearCookie("loggedIn");
//       res.render("user-login", {subreddit: "Your account has been blocked"})
//     }
//     next();
//   } catch(error) {
//     console.log(error)
//   }
// }
