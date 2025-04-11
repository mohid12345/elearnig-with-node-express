const creatorCollection = require("../../models/creatorSchema")

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


