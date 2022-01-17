const mongoose = require("mongoose")
const GoogleUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    isverify: {
        type: Boolean,

    },


}, { timestamps: true })
module.exports = mongoose.model("GoogleUser", GoogleUserSchema)