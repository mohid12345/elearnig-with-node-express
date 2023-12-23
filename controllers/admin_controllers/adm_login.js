const adminCollection = require("../../models/adminSchema");

module.exports.getAdminLogin = async (req, res) => {
    if (req.session.admin) {
    //   users = await userCollection.find({});
      res.render("adminDashboard");
    } else {
      res.render("adminLogin");
    }
  };

module.exports.getAdminLogout = (req,res) =>{
  req.session.admin = null
  res.redirect("/admin/adminLogin")
}
// module.exports.getAdminLogout = (req,res) =>{
//  if(req.session.admin){
//   res.send("send logout")
//  }
// }

module.exports.postAdminDashboard = async (req, res) =>{
    const data = await adminCollection.findOne({ email: req.body.email});
    if (data) {
        if(req.body.email !== data.email) {
            res.render("adminLogin", {subreddit: "incorrect email"});
        } else if ( req.body.password !== data.password) {
            res.render("adminLogin", {subreddit:"incorrect password"});
        } else {
            if(req.body.email == data.email && req.body.password == data.password) {
                req.session.admin = data.email;
                const admin = req.session.admin;
                res.render("adminDashboard", {admin});
                // res.send("admin logged success")
                // console.log("admin logged success")
            }
        }
    } else {
        res.redirect ("../");
    }
};

module.exports.getAdminDashboard = async (req, res) => {
    if (req.session.admin) {
    //   users = await userCollection.find({});
      res.render("adminDashboard");
    } else {
      res.render("adminLogin");
    }
  };
//   res.render("adminDashboard");
// }



module.exports.getAdminLogout = (req, res) =>{
    req.session.admin = null;
    console.log(req.session);
    res.redirect("/admin");
};
module.exports.getUserManage = (req, res) =>{
    res.render("admin-usermanage");
    // res.send("hello");
};
module.exports.getCreatorManage = (req, res) =>{
    res.render("admin-creatormanage");
    // res.send("hello");
};
module.exports.getProductList = (req, res) =>{
    res.render("admin-productlist");
    // res.send("hello");
};
