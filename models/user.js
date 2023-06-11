const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    subscriptionStatus: {
        type: String,
        enum: ["Basic", "Standard", "Premium"],
        default: "Basic",
      },
      wordsLeft: {
        type: Number,
        default: 0,
      },
}, { timestamps: true });

module.exports = mongoose.model("user", UserSchema);