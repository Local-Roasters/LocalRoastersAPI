const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phoneID: {
    type: Number,
    required: true
  },
  coffee: {
    roast: String
  },
  price: {
    type: Number,
    required: true
  },
  drink: {
    size: String,
    hot: Boolean,
    nonDairy: Boolean
  }
});

//Export the model using the schema above
module.exports = mongoose.model("user", userSchema);
