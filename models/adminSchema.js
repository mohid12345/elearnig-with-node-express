const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
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
    password: {
        type: String,
        require: true,
    } ,
});

const adminCollection = mongoose.model("adminCollection", adminSchema);

module.exports = adminCollection;