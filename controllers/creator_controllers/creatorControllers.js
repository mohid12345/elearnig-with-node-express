const creatorCollection = require("../../models/creatorSchema");

module.exports.getCreatorLogin = (req,res)=>{
    if(req.session.creator){
        res.render("creatorDashboard");
    // res.send("creator dashboard reached")
    } else {
        // res.redirect("/creatorLogin");
        res.render("creatorLogin");
        // res.send("res from no creator session")
    }
}
module.exports.postCreatorLogin = async(req,res)=>{
    const creatorData = await creatorCollection.findOne({email:req.body.email})
    // console.log(creatorData)
     if(!creatorData){
        res.render("creatorLogin")
     } else {
        if(creatorData){    
            if(req.body.email!=creatorData.email){
                res.render("creatorLogin",{subreddit:"This email is not registered"});
        } else if (req.body.password != creatorData.password){
            res.render("creatorLogin", {subreddit:"Incorrect password entered"});
        } else{
            if(req.body.email==creatorData.email&&req.body.password==creatorData.password){
                res.render("creatorDashboard")
            }
        }
     } else { 
        res.redirect("")
    }
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
            creatorName:req.body.creatorName,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password,
            status: "unblocked",
        });
     
        res.redirect("/creator/creatorLogin");
    }
}


module.exports.creatorLogout = (req,res) =>{
    res.clearCookie("token");
    res.clearCookie("loggedIn");
    res.redirect("/creatorLogin")
}

