const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.verifyAdmin = (req,res,next) => {
  const token2 = req.cookies.token2;
  const verifyToken = jwt.verify(
    token2, 
    process.env.JWT_SECRET_KEY,
    (err, decoded) => {
      if(err) {
        return res.redirect ("/admin/adminLogin");
      }
      req.admin = decoded;
      next(); //if success passes to next callback
    }
  )
};
