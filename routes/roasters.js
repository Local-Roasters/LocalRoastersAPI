const express = require("express");
const config = require("config");
// const auth = require("../middleware/requireAuth");
const fetch = require("node-fetch");
const reverse = require("reverse-geocode");
const router = express.Router();
const NodeGeocoder = require("node-geocoder");

const Roaster = require("../models/Roaster");

//Grab env vars
// const API_KEY = process.env.OWM || config.get("DARK");
//Get roasters via location
router.get("/yelp", (req, res) => {
  console.log(req.query);
  const { latitude, longitude } = req.query;
  //De-structure the request's data
  if (!latitude || !longitude) {
    return res.status(400).json({
      msg: "Did not send proper latitude and longitude in request queries."
    });
  }
  fetch(
    `https://api.yelp.com/v3/businesses/search?term=coffee&latitude=${latitude}&longitude=${longitude}&radius=500&limit=50`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BEARER}`
      }
    }
  )
    .then(res => res.json())
    .then(json => {
      console.log(json);
      res.json(json);
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).send("Server Error");
    });
}); //Note that "/" here refers to the prefix of "api/roasters"

router.post("/", async (req, res) => {
  try {
    const { name, location, coffee, price, rating, extraCost, img } = req.body;
    //
    // Get latidude & longitude from address.

    let roaster = await Roaster.findOne(
      { "location.streetName": location.streetName },
      { "location.addressNumber": location.number }
    );
    if (roaster) {
      res.status(400).json({ msg: "This roaster already exists" });
    }
    if (!name || !location || !coffee || !price) {
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
    }
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
