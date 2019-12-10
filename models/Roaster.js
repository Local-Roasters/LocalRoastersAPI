const mongoose = require("mongoose");

const roasterSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    streetName: String,
    number: Number,
    zip: Number
  },
  coffee: {
    roast: String,
    roaster: String
  },
  sustainable: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    default: "https://i.imgur.com/qyLAVyH.png"
  },
  rating: {
    type: Number,
    default: 0
  },
  extraCost: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("roaster", roasterSchema);
