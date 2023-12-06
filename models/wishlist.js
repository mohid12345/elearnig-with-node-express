const mongoose = require("mongoose");

const wishlist = {
    customerId : {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'userSchema'
    },
    wishlistCourses: [{
        productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'course'
        }
    }]
}

const userWishlistSchema = new mongoose.model('wishlist',wishlist)

module.exports = userWishlistSchema;