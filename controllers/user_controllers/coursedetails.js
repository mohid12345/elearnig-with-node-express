const courseCollection = require("../../models/course");

require('dotenv').config();
const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET_KEY

// render product detail page
module.exports.courseDetails = async(req,res) => {
  try{
    const loggedIn = req.cookies.loggedIn;
    const Idcourse = req.params.courseId;
    const coursedata = await courseCollection.findById({_id:Idcourse})
    res.render("courseDetails", {loggedIn, coursedata})
  } catch(error) {
    console.error(error)
  }
}