const mongoose = require("mongoose");

const customer = new mongoose.Schema({
  custid: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    default: 0.0,
  },
  role: {
    type: String,
    default:"customer"
  },
});

module.exports = mongoose.model("customer",customer);