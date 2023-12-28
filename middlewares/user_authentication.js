const userCollection = require("../models/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.verifyUser = (req,res,next) => {
  const token = req.cookies.token;
  const verifyToken = jwt.verify(
    token, 
    process.env.JWT_SECRET_KEY,
    (err, decoded) => {
      if(err) {
        return res.redirect ("/userLogin");   
      }
      req.user = decoded;
      next();
    }
  )
};

module.exports.checkBlockedStatus = async (req,res,next) => {
    const user = req.user;
    const curruser = await userCollection.findOne({email: user});
    if (curruser.status === "Block") {
      res.clearCookie("token");
      res.clearCookie("loggedIn");
      res.render("userLogin", {subreddit: "User is blocked"})
    }
    next();
};
