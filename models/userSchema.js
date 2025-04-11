const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate")

const userSchema = new mongoose.Schema({
username: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  phoneNumber: {
    required: true,
    type: Number,
  },
  status: {
    required: true,
    type: String,
  },
});

const userCollection = mongoose.model("userCollection", userSchema);

module.exports = userCollection;