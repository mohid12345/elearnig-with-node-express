// require('dotenv').config();
const userCollection = require("../../models/userSchema");

module.exports.getUserLogout = (req, res) => {
    try{
    res.clearcookie("token");
    res.clearcookie("loggedIn");
    res.render("main");
    } catch(error){
        console.error(error);
        res.status(500).render("500")
    }
};

module.exports.getUserSignup = (req, res) => {
    try{
        res.render("userSignup");
    } catch(error) {
        console.error(error);
        res.status(500).render("500");
    }
};

module.exports.postUserSignup = async (req, res) => {
    const data = await userCollection.findOne({ email: req.body.email });
    if (data) {
        res.render("userSignup", {
            error: "User With this email Already Exist try with different Email",
        });
    } else {
        await userCollection.create({
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            status: "unblocked",
        });
        res.redirect("/userLogin");
    }
};

