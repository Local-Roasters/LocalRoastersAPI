const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  coffee: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

//Export the model using the schema above
module.exports = mongoose.model("user", userSchema);
