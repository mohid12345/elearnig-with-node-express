const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema({
    fname: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    phone: {
        required: true,
        type: Number,
    },
    password: {
        required: true,
        type: String,
    },
    status: {
        type: String,
    },
});

const creatorCollection = mongoose.model("creatorCollection", creatorSchema);

module.exports = creatorCollection;
