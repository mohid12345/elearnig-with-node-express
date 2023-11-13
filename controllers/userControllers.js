// const {TWILIO_SERVICE_SID,TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN} = process.env;
// const client = require('twilio')(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,{
//     lazyLoading: true
// })

// require('dotenv').config();
// const userCollection = require("../models/userSchema");
// const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
// const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
// const TWILIO_SERVICE_ID = process.env.TWILIO_SERVICE_ID;
// const twilio = require("twilio")(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN)
// const jwt = require("jsonwebtoken");
// const secretkey = process.env.JWT_SECRET_KEY

module.exports.getUserRoute = (req, res) => {
    if (req.session.user) {
        res.redirect("userDashboard");
    } else {
        res.render("main");
    }
};

//postLogin start
module.exports.postLogin = async (req, res) => {
    if (req.session.user) {
        // The user is already logged in, redirect them to their dashboard
        return res.render("userLoginOtp");
    }
    const { email, password } = req.body;
    try {
        const user = await userCollection.findOne({ email }); //find email from db
        if (!user) {
            return res.render("userLogin", { error: "Incorrect email" });
        }
        // Compare the hashed password
        if (user.password !== password) {
            return res.render("userLogin", { error: "Incorrect password" });
        }
        req.session.user = user.email;
        return res.render("userLoginOtp");
    } catch (error) {
        console.error("Login error:", error);
        return res.render("errorPage", { error: "An error occurred during login" });
    }
};

module.exports.getUserDashboard = (req, res) => {
    if (req.session.user) {
        const user = req.session.user;
        res.render("userDashboard", { user });
    }
};

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
            email: req.body.email,
            fname: req.body.fname,
            lname: req.body.lname,
            phone: req.body.phone,
            password: req.body.password,
        });
        res.redirect("/");
    }
};
//////

require("dotenv").config();
const userCollection = require("../models/userSchema");
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_SERVICE_ID = process.env.TWILIO_SERVICE_ID;
const twilio = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET_KEY;

/////
const sendOTPRequest = {
    body: {
        countryCode: "+91", // Replace with the actual country code
        phoneNumber: "7907396181", // Replace with the actual phone number
    },
};
///

// const sendOTP = async (sendOTPRequest, res, next) =>{
module.exports.sendOTP = async (sendOTPRequest, res, next) => {
    // const { countryCode, phoneNumber} = req. body;
    const { countryCode, phoneNumber } = req.body;
    try {
        const otpResponse = await client.verify.services(TWILIO_SERVICE_SID).verifications.create({
            to: `+${countryCode}${phoneNumber}`,
            channel: "sms",
        });
        res.status(200).send(`OTP send successfully!: ${JSON.stringify(otpResponse)}`);
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || "Something went wrong");
    }
};

const verifyOTPRequest = {
    body: {
        countryCode: "+91", // Replace with the actual country code
        phoneNumber: "7907396181", // Replace with the actual phone number
        otp: "", // Replace with the actual OTP
    },
};

module.exports.verifyOTP = async (verifyOTPRequest, res, next) => {
    const { countryCode, phoneNumber, otp } = req.body;
    try {
        const verifiedResponse = await client.verify.services(TWILIO_SERVICE_SID).verificationChecks.create({
            to: `+${countryCode}${phoneNumber}`,
            code: otp,
        });
        res, status(200).send(`OTP verification successfully!: ${JSON.stringify(verifiedResponse)}`);
        console.log("succesfull");
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || "Something went wrong");
    }
};

/////////////////////////////////////////////////////////
//laxmans code
// sending otp
// module.exports.getSendOtp = async(req,res) => {
//     try {
//       console.log("send otp function reached");
//       const phoneNumber = req.query.phoneNumber;
//       const userdata = req.query;
//       console.log(phoneNumber);
//       console.log(userdata);
//       // sending the opt using twilio
//       await twilio.verify.v2.services(TWILIO_SERVICE_ID).verifications.create({
//         to: +91${phoneNumber},
//         channel: 'sms',
//       });
//       res.json({message: "OTP sent successfully"})
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({error: "Failed to send OTP"})
//     }
//   };

// //   // veify otp
//   module.exports.postVerifyOtp = async (req,res) => {
//     try {
//       console.log("reached");
//       const phoneNumber = req.query.phoneNumber;
//       console.log(phoneNumber)
//       const otp = req.query.otpInput;
//       console.log(otp)
//       const verificationCheck = await twilio.verify.v2.services(process.env.TWILIO_SERVICE_ID).verificationChecks.create({
//         to: +91${phoneNumber},
//         code: otp,
//       });
//       console.log("revieved below")
//       console.log("verificationChecks: ", verificationCheck);
//       if (verificationCheck.valid) {
//         console.log("verified");
//         res.status(200).json({data: "OTP verified succussfullly"})
//       } else {
//         res.status(400).json({ error: "Invalid OTP"})
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Failed to verify OTP"})
//     }
//   }

//////////////////////////////////////////////
