const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TextDocumentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },

    gptresponse: {
      type: String,
      required: false,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("document", TextDocumentSchema);

// user: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: true
//   }
//   const product = new Product({
//     user: user._id,
//     // other fields
//   });
//   Product.findById(productId).populate('user').exec((err, product) => {
//     // product.user will be the full user document
//   });
