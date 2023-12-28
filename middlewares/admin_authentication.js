const jwt = require("jsonwebtoken");
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
      next(); //if success passes to next callback
    }
  )
};
