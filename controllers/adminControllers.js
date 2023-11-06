const adminCollection = require("../models/adminSchema");

module.exports.getAdminRoute = (req, res) =>{
    // if(req.session.admin){
    //     res.redirect("admin/adminLogin");
    // } else {
    //     res.render("main");
    // }
    res.render("adminLogin");
}

module.exports.postAdminLogin = async (req, res) =>{
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
                // res.render("course", {user});
                res.send("admin logged success")
            }
        }
    } else {
        res.redirect ("../");
    }
};

module.exports.getAdminDashboard = (req, res) =>{
    if (req.session.admin) {
        const admin = req.session.admin;
        res.render("adminDashboard", { admin });
    }
};

module.exports.getAdminLogout = (req, res) =>{
    req.session.admin = null;
    console.log(req.session);
    res.redirect("/admin");
};