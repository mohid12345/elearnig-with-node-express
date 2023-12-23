const cartCollection = require("../../models/cart")
const userCollection = require("../../models/userSchema")
const courseCollection = require("../../models/course");



require('dotenv').config();
const jwt = require("jsonwebtoken")
const { default : mongoose } = require("mongoose")
const secretkey = process.env.JWT_SECRET_KEY


module.exports.getCartPage = async (req, res) => {
    try{
        const userData = await userCollection.findOne({email:req.user})
        const userName = userData.username
        const userId = userData._id

        const loggedIn = req.cookies.loggedIn
        const username = req.cookies.username;

        const cartDetails = await cartCollection.findOne({userId: userId}).populate('courses.courseId')
        console.log("cart details are: ",cartDetails);
        res.render("userCart", {loggedIn, username,cartDetails})

    } catch (error){
        res.status(500).send('Internal Server Error')
    }
}

module.exports.postCartPage = async (req, res) =>{
    try {
        const userData = await userCollection.findOne({email: req.user})
        const userId = userData._id;
        const courseId = req.query.courseId;

        let userCart = await cartCollection.findOne({userId: userId})
        if(!userCart){
            userCart = new cartCollection({
                userId,
                courses: [],
            })
        }
        const existingCourseIndex = userCart.courses.findIndex(
            (course) => course.courseId.toString() === courseId
        );
        console.log("dat6:",userCart);
        if(existingCourseIndex !== -1) {
            // res.json({message: "Course already in cart"})
        } else {
            userCart.courses.push({
                courseId: new mongoose.Types.ObjectId(courseId),
            });
        }
        await userCart.save()
        res.json({message: "Course added to the Cart"})

    } catch(error){
        console.log("Error adding to the cart:", error);
        res.status(500).json({error:"Failed to add course to cart"})
    }
} 

module.exports.deleteCart = async(req, res)=>{
    try{
        const courseId = req.query.courseId
        const userData = await userCollection.findOne({email: req.user})
        const userId = userData._id;

        //assuming, havea  course schema with field _id
        const courseObjectId  = new mongoose.Types.ObjectId(courseId)

        //assuming you have asame schema with field _id
        const result = await cartCollection.updateOne(
            {userId: userId},
            {$pull: { courses: {_id: courseObjectId}}}
        );
        if(result.upsertedCountnModified === 1) {
            console.log("Course removed from wishlist");
            res.status(200).redirect("/userCart");
        } else {
            console.log("Course not found in the user's cart")
            res.status(404).redirect("/userCart")
        }
    } catch (error){
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
}
