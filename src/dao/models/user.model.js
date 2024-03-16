const mongoose = require("mongoose");
const Cart = require("./cart.model.js");

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },

  last_name: {
    type: String,
    // required: true,
  },

  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },

  password: {
    type: String,
    // required: true,
  },

  age: {
    type: Number,
    // required: true,
  },

  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },

  role: {
    type: String,
    default: "user",
  },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
