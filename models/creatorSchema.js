const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema({
creatorName: {
    required: true,
    type: String,
  },
email: {
    required: true,
    type: String,
    unique: true
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
    type: String,
  },
});


const creatorCollection = mongoose.model("creatorCollection", creatorSchema);

module.exports = creatorCollection;