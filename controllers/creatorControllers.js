const creatorCollection = require("../models/creatorSchema");
const adminCollection = require("../models/creatorSchema");

module.exports.getCreatorLogin = (req,res)=>{
    if(req.session.creator){
        res.render("creatorDashboard");
    res.send("creator dashboard reached")
    } else {
        // res.redirect("/creatorLogin");
        res.render("creatorLogin");
        // res.send("res from no creator session")
    }
}

module.exports.getCreatorSignup = (req,res)=>{
    res.render("creatorSignup");
}

module.exports.postCreatorSignup = async(req,res)=>{
    const data = await creatorCollection.findOne({email:req.body.email});
    if (data) {
        res.render("creatorSignup",{error:"creator with this email already exist - try different ", });
    } else {
        await creatorCollection.create({
            fname:req.body.fname,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password,
        });
        res.redirect("/");
    }
}