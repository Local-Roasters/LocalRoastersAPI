const express = require("express");
const config = require("config");
// const auth = require("../middleware/requireAuth");
const fetch = require("node-fetch");
const reverse = require("reverse-geocode");
const router = express.Router();
const NodeGeocoder = require("node-geocoder");

const Roaster = require("../models/Roaster");

//Create a new roaster!
router.post("/", async (req, res) => {
  try {
    const { name, location, coffee, price, rating, extraCost, img } = req.body;

    //Sanitize location street name
    location.streetName = location.streetName.toLowerCase();
    let roaster = await Roaster.findOne({
      $and: [
        { "location.streetName": location.streetName },
        { "location.number": location.number }
      ]
    });
    console.log(roaster);
    if (roaster) {
      res.status(400).json({ msg: "This roaster already exists" });
    } else if (!name || !location || !coffee || !price) {
      res.status(400).json({
        msg:
          "Please ensure you provided a name, location, coffee and price information."
      });

      //Not working
      if (!location["zip"] || !location.streetName || !location.number) {
        res.status(400).json({
          msg:
            "Please ensure you provided location with address, number, and zip code"
        });
      }
    } else {
      const options = {
        provider: "google",

        // Optional depending on the providers
        httpAdapter: "https", // Default
        apiKey: `${process.env.GOOGLE_GEO}`, // for Mapquest, OpenCage, Google Premier
        formatter: null // 'gpx', 'string', ...
      };

      let geocoder = NodeGeocoder(options);
      let resArr = await geocoder
        .geocode(`${location.number} ${location.streetName}  New York`)
        .then(function(res) {
          return res;
        })
        .catch(function(err) {
          console.log(err);
        });
      // async let  resArr = geocoder.geocode(
      //   `${location.number} ${location.streetName}  New York`
      // );
      await console.log(resArr);
      let { latitude, longitude } = await resArr[0];
      location.latitude = latitude;
      location.longitude = longitude;

      roaster = new Roaster({
        name,
        location,
        coffee,
        price,
        rating,
        extraCost,
        img
      });
      console.log(roaster);
      console.log(location);
      await roaster.save();
      res.status(200).json({ msg: `Added new roaster ${name}!` });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/", async (req, res) => {
  try {
    let { latitude, longitude } = req.query;
    let { zipcode } = reverse.lookup(latitude, longitude, "us");
    let roasterArr = await Roaster.find({ "location.zip": zipcode });
    console.log(roasterArr);
    res.send(roasterArr);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
