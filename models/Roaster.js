const mongoose = require("mongoose");

const roasterSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  coffee: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  img: {
    type: String
  },
  beans: {
    type: Number
  }
});

module.exports = mongoose.model("roaster", roasterSchema);
