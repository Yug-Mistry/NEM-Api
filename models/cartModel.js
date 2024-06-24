const mongoose = require('mongoose')


const itemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  quantity: {
    type: Number,
    default: 0,
  },
  image:{
    type: String
  },
  price:{
    type: Number
  }, 
  title:{
    type: String
  }
});

const cartSchema = mongoose.Schema({
  products: [itemSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  total: {
    type: Number,
    default: 0,
  },
  __v: { type: Number, select: false },
});

exports.Cart = mongoose.model("Cart", cartSchema);
