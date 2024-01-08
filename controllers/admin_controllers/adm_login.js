const adminCollection = require("../../models/adminSchema");

require('dotenv').config();
const jwt = require("jsonwebtoken");
const orderCollection = require("../../models/order");
const courseCollection = require("../../models/course");
const categoryCollection = require("../../models/category");
const userCollection = require("../../models/userSchema");
const secretkey = process.env.JWT_SECRET_KEY

module.exports.getAdminLogin = async (req, res) => {
   try {
       res.render("adminLogin")
  } catch (error) {
    console.error(error)
    res.send(error).json("internal server error")
  }
}

module.exports.getAdminLogout = (req,res) =>{
    res.clearCookie("token2");
    res.clearCookie("loggedIn2");
    res.redirect("/admin/adminLogin")
}

module.exports.postAdminDashboard = async(req,res) => {
  const admindata = await adminCollection.findOne({ email: req.body.email});
  if (!admindata) {
    res.render("adminLogin", {subreddit: "The email is not registered"});
  } else {
    if (admindata){
      if (req.body.email != admindata.email) 
      {
        res.render("adminLogin", {subreddit:"This email not registered"});
      } else if (req.body.password != admindata.password)
      {
        res.render("adminLogin", {subreddit: "Incorrect passaword"});
      } else 
      {
        if ( req.body.email == admindata.email && req.body.password == admindata.password ) 
        { 
          try {
          email = req.body.email;
          const token = jwt.sign(email, secretkey);
          res.cookie("token2", token, { maxAge: 24 * 60 * 60 * 1000 });
          res.cookie("loggedIn2", true, { maxAge: 24 * 60 * 60 * 1000 });
          res.status(200);
          res.redirect("/admin/adminDashboard")
          } catch (error) {
              console.log(error);
              res.status(500).json({ error: "Internal Server Error" });
          }
        } 
      }
    } else {
      res.redirect("/admin/adminLogin")
    }
  }
}

module.exports.getAdminDashboard = async (req, res) => {
    if (req.cookies.loggedIn2) {
      const dash_sum = await orderCollection.aggregate([
        {
          $group: {
            _id : null,
            totalAmount : { $sum : "$totalAmount"}
          }
        }
      ])
      const dash_order = await orderCollection.countDocuments({});
      const dash_tabledata = await orderCollection.find({});
      const dash_product = await courseCollection.countDocuments({})
      const dash_catg = await categoryCollection.countDocuments({})
      const dash_user = await userCollection.countDocuments({})
      res.render("adminDashboard", { dash_sum: dash_sum , dash_order:dash_order,dash_product: dash_product,
        dash_catg: dash_catg, dash_user: dash_user, dash_tabledata: dash_tabledata} );
    } else {
      res.render("adminLogin");
    }
  };

module.exports.getUserManage = (req, res) =>{
    res.render("admin-usermanage");
};
module.exports.getCreatorManage = (req, res) =>{
    res.render("admin-creatormanage");
};
module.exports.getProductList = (req, res) =>{
    res.render("admin-productlist");
};
