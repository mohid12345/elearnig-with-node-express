// require('dotenv').config();
const userCollection = require("../../models/userSchema");
// const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
// const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
// const TWILIO_SERVICE_ID = process.env.TWILIO_SERVICE_ID;
// const twilio = require("twilio")(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN);
// const jwt = require("jsonwebtoken");
// const secretkey = process.env.JWT_SECRET_KEY



// module.exports.getUserDashboard = (req, res) => {
//     if (req.session.user) {
//         const user = req.session.user;
//         res.render("userDashboard", { user });
//     }
// };

module.exports.getUserLogout = (req, res) => {
    req.session.user = null;
    // console.log(req.session);
    // res.redirect("/user");
    res.render("main");
};

module.exports.getUserSignup = (req, res) => {
    res.render("userSignup");
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

