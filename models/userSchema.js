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
// username: {
//     required: true,
//     type: String,
//   },
//   email: {
//     required: true,
//     type: String,
//     unique: true
//   },
//   password: {
//     required: true,
//     type: String,
//   },
//   confirmpassword: {
//     required: true,
//     type: String,
//   },
//   phoneNumber: {
//     required: true,
//     type: Number,
//   },
//   otpInput:{
//     required:true,
//     type:Number,
//   },
//   status: {
//     type: String,
//   },
// });


const userCollection = mongoose.model("userCollection", userSchema);

module.exports = userCollection;