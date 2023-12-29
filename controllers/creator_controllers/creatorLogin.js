const creatorCollection = require("../../models/creatorSchema");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET_KEY;

module.exports.getCreatorLogin = (req, res) => {
    try {
          res.render("creatorLogin");
        } catch (error) {
        console.error("error in getting login page", error);
        res.status(500).send("internal server error");
    }
};
//test1
// module.exports.getCreatorLogin = (req, res) => {
//     try {
//         if (req.cookies.creatordate) {
//             res.redirect("/creator/creatorDashboard");
//         } else {
//             res.render("creatorLogin");
//         }
//     } catch (error) {
//         console.error("error in getting login page", error);
//         res.status(500).send("internal server error");
//     }
// };
module.exports.postCreatorLogin = async (req, res) => {
    const creatorData = await creatorCollection.findOne({ email: req.body.email });
    // console.log(creatorData)
    if (!creatorData) {
        res.render("creatorLogin", { subreddit: "The email is not registered" });
    } else {
        if (creatorData) {
            if (req.body.email != creatorData.email) {
                res.render("creatorLogin", { subreddit: "This email is not registered" });
            } else if (req.body.password != creatorData.password) {
                res.render("creatorLogin", { subreddit: "Incorrect password entered" });
            } else {
                if (req.body.email == creatorData.email && req.body.password == creatorData.password) {
                    {
                        try {
                            email = req.body.email;
                            const token = jwt.sign(email, secretkey);
                            res.cookie("token1", token, { maxAge: 24 * 60 * 60 * 1000 });
                            res.cookie("loggedIn1", true, { maxAge: 24 * 60 * 60 * 1000 });
                            res.status(200);
                            res.render("creatorDashboard");
                        } catch (error) {
                            console.log(error);
                            res.status(500).json({ error: "Internal Server Error" });
                        }
                    }
                }
            }
        } else {
            res.redirect("/creator/creatorLogin");
        }
    }
};

// module.exports.creatorLogout = (req,res) =>{
//     res.clearCookie("token");
//     res.clearCookie("loggedIn");
//     res.redirect("/creator/creatorLogin")
// }
module.exports.creatorLogout = (req, res) => {
    res.clearcookie("token1");
    res.clearcookie("loggedIn1");
    res.redirect("/creatorLogin");
};
