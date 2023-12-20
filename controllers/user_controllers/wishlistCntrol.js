const courseCollection = require("../../models/course");
const userCollection = require("../../models/userSchema");
const wishlistCollection = require("../../models/wishlist");

require('dotenv').config();
const jwt = require("jsonwebtoken");
const { default : mongoose } = require("mongoose");
const secretkey = process.env.JWT_SECRET_KEY



module.exports.getWishlistPage = async (req,res) => {
    try {
        // console.log(req.user);
        const userData = await userCollection.findOne({email:req.user}) //finding user
        const userName = userData.username// working
        const userId = userData._id; //userid to userId- working

        const loggedIn = req.cookies.loggedIn;
        // console.log(loggedIn, "111")//this is a boolean
        const username = req.cookies.username;

        const wishlistDetails = await wishlistCollection.findOne({userId: userId}).populate('courses.courseId');
        // console.log(wishlistDetails)// these aree courses ids
        res.render("userWishlist",  {loggedIn, username, wishlistDetails});       
        
    } catch (error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports.postWishlistPage = async (req, res) => {
    try{
        const userData = await userCollection.findOne({email: req.user})
        if(!userData){
            res.redirect("/userLogin")
        }
        const userId = userData._id;
        const courseId = req.query.courseId;

        let userWishlist = await wishlistCollection.findOne({ userId: userId });
        if(!userWishlist) {
            userWishlist = new wishlistCollection({
                userId,
                courses: [],
            });
        }

        const existingCourseIndex = userWishlist.courses.findIndex(
            (course) => course.courseId.toString() === courseId
        );
        // console.log(userWishlist);

        if(existingCourseIndex !== -1) {
            // userWishlist.courses[existingCourseIndex].quantity += 1;
            // res.json({message: "Course already in wishlist.."});
        } else {
            userWishlist.courses.push({
                courseId: new mongoose.Types.ObjectId(courseId),
                //  courseId: courseId // this will actually do the job- already courseId got from fetch
                // quantity: 1,
            });
        }
        await userWishlist.save();
        res.json({message: "Course added to the cart"});
    } catch(error){
        console.log("Error adding to the wishlist:", error);
        res.status(500).json({error: "Failed to add the course to wishlist"});
    }
}

module.exports.deleteWishlist = async (req, res) =>{
    try {
        const courseId = req.query.courseId;
        const userData = await userCollection.findOne({email : req.user});
        const userId = userData._id;

        //assuming you have a product schema with a field _id
        const courseObjectId = new mongoose.Types.ObjectId(courseId)

        const result = await wishlistCollection.updateOne(
            { userId : userId},
            { $pull: { courses: { _id: courseObjectId }}}
        );
        if (result.nModified === 1 ) {
            console.log("Course removed form the wishlist");
            res.status(200).redirect("/userWishlist");
        } else {
            console.log("Course not found in the user's cart");
            res.status(404).redirect("/userWishlist");//404 for not found
        }
    } catch(error) {
        console.error(error);
        res.status(500).send("Internal Server Error")

    }
};