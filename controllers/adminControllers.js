const adminCollection = require("../models/adminSchema");

// module.exports.getAdminRoute = (req, res) =>{
//     if(req.session.admin){
//         res.redirect("admin/adminLogin");
//     } else {
//         res.render("main");
//     }
//     res.render("adminLogin");
// }

module.exports.getAdminRoute = async (req, res) => {
    if (req.session.admin) {
    //   users = await userCollection.find({});
      res.render("adminDashboard");
    } else {
      res.render("adminLogin");
    }
  };

module.exports.postAdminRoute = async (req, res) =>{
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



// module.exports.postAdminRoute = async (req, res) => {
//     const data = await adminCollection.findOne({ email: req.body.email });
//     const users = await userCollection.find({});
//     if (data) {
//       if (req.body.email !== data.email && req.body.password === data.password) {
//         res.redirect("/admin");
//       } else if (
//         req.body.email === data.email &&
//         req.body.password !== data.password
//       ) {
//         res.redirect("/admin");
//       } else {
//         if (
//           req.body.email === data.email &&
//           req.body.password === data.password
//         ) {
//           req.session.admin = req.body.email;
//           res.render("adminDashboard", { users });
//         }
//       }
//     } else {
//       res.redirect("/");
//     }
//   };


module.exports.getAdminDashboard = (req, res) =>{
    // if (req.session.admin) {
    //     const admin = req.session.admin;
        // res.render("adminDashboard", { admin });
        res.render("adminDashboard");
    }
// };

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