const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  coffee: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

//Export the model using the schema above
module.exports = mongoose.model("user", userSchema);
