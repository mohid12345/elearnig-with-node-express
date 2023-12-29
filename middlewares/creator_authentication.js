const creatorCollection = require("../models/creatorSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.verifyCreator = (req,res,next) => {
  const token1 = req.cookies.token1; 
  const verifyToken = jwt.verify(token1,process.env.JWT_SECRET_KEY,(err, decoded) => {//this isdecoding process
      if(err) {
        return res.redirect ("/creatorLogin");   
      }
      req.creator = decoded; //decoded data stored in req.creator and used further
      // console.log("111:",req.creator);
      next();
    }
  )
};

module.exports.checkBlockedStatus = async (req,res,next) => {
    const creator = req.creator;
    // console.log("222: ",req.creator);
    const currcreator = await creatorCollection.findOne({email: creator});
    // console.log("mid 1: ",currcreator );
    if (currcreator.status === "Block") {
      res.clearCookie("token1");
      res.clearCookie("loggedIn1");
      res.render("creatorLogin", {subreddit: "Creator is blocked"})
    }
    next();
};
