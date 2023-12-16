const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema ({
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

const cart = mongoose.model("cart", cartSchema);


module.exports = cart;