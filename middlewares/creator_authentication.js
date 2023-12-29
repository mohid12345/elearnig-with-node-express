const creatorCollection = require("../models/creatorSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.verifyCreator = (req,res,next) => {
  const token = req.cookies.token;
  const verifyToken = jwt.verify(
    token, 
    process.env.JWT_SECRET_KEY,
    (err, decoded) => {
      if(err) {
        return res.redirect ("/creatorLogin");   
      }
      req.user = decoded;
      next();
    }
  )
};

module.exports.checkBlockedStatus = async (req,res,next) => {
    const creator = req.creator;
    const currcreator = await creatorCollection.findOne({email: creator});
    if (currcreator.status === "Block") {
      res.clearCookie("token");
      res.clearCookie("loggedIn");
      res.render("creatorLogin", {subreddit: "Creator is blocked"})
    }
    next();
};
