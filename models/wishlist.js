const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema ({
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'userCollection'
    },
    courses: [{
        courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'courseCollection'
        }
    }]
});

const wishlist = mongoose.model("wishlist", wishlistSchema);


module.exports = wishlist;