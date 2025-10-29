const courseCollection = require("../../models/course");
const orderCollection = require("../../models/order");
const userCollection = require("../../models/userSchema");

require('dotenv').config();
const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET_KEY

// render product detail page
module.exports.courseDetails = async(req,res) => {
  try{
    const loggedIn = req.cookies.loggedIn;
    const Idcourse = req.params.courseId;
    const coursedata = await courseCollection.findById({_id:Idcourse})

    let hasPurchased = false;

    // Try to identify user from token cookie if available (route is public)
    try {
      const token = req.cookies.token;
      if (token) {
        const decoded = jwt.verify(token, secretkey);
        if (decoded) {
          const userData = await userCollection.findOne({ email: decoded });
          if (userData) {
            const userId = userData._id;
            const existingOrder = await orderCollection.findOne({
              userId,
              paymentStatus: "Success",
              "courses.courseId": Idcourse,
            });
            hasPurchased = !!existingOrder;
          }
        }
      }
    } catch (e) {
      // ignore token errors; treat as not purchased
    }

    res.render("courseDetails", {loggedIn, coursedata, hasPurchased})
  } catch(error) {
    console.error(error)
  }
}