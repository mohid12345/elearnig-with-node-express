const creatorCollection = require("../../models/creatorSchema")


module.exports.getCreatorLogin = (req,res)=>{
    try{
    if(req.session.creator){
        res.redirect("/creator/creatorDashboard");
    } else {
        res.render("creatorLogin");
    }
} catch (error) {
    console.error("error in getting login page", error)
    res.status(500).send('internal server error')
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

module.exports.creatorLogout = (req,res) =>{
    res.clearCookie("token");
    res.clearCookie("loggedIn");
    res.redirect("/creator/creatorLogin")
}
