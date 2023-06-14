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
        enum: ["Free plan", "Basic", "Standard", "Premium"],
        default: "Free plan",
      },
      wordsLeft: {
        type: Number,
        default: 500,
      },
}, { timestamps: true });

module.exports = mongoose.model("user", UserSchema);