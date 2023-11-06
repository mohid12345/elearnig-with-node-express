const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    fname: {
        type: String,
        required: true,
      },
    lname: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    } ,
    password: {
        type: String,
        require: true,
    } ,
});

const userCollection = mongoose.model("userCollection", userSchema);

module.exports = userCollection;