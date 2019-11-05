const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phoneID: {
    type: String,
    required: true
  },
  coffee: {
    type: Object,
    roast: {
      type: String
    },
    required: true
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
