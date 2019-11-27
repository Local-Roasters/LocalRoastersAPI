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
    roaster: String,
    sustainable: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    default: "https://imgur.com/3f1557d5-16fa-4848-a4c7-56a6759765d6"
  },
  rating: {
    type: Number,
    default: 0
  },
  extraCost: {
    nonDairy: Boolean,
    default: false
  }
});

module.exports = mongoose.model("roaster", roasterSchema);
