const courseCollection = require("../../models/course")

module.exports.getWishlistPage = async (req,res) => {
    try {
        const loggedIn = req.cookies.loggedIn;
        if(!loggedIn){
            res.render("userLogin");
        } else {
        res.render("userWishlist");
        }
    } catch (error){
        console.error(error);
    }
}