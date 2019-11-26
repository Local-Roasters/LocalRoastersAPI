const express = require("express");
const reverse = require("reverse-geocode");
const NodeGeocoder = require("node-geocoder");
const Roaster = require("../models/Roaster");
const router = express.Router();
/**
 * @todo Add filter by price
 */

/**
 * Endpoint .../roasters/by-price returns an array of
 * roasters given location by ascending price
 * Method: GET
 */
router.get("/by-price/low-to-high", async (req, res) => {
  try {
    let { latitude, longitude } = req.query;
    let { zipcode } = reverse.lookup(latitude, longitude, "us");
    let roasterArr = await Roaster.find({ "location.zip": zipcode });
    roasterArr.sort((a, b) => a.price - b.price);
    console.log(roasterArr);
    res.send(roasterArr);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/**
 * Endpoint .../roasters/by-price returns an array of
 * roasters given location by specific price
 * Method: GET
 */
router.get("/by-price/", async (req, res) => {
  try {
    let { latitude, longitude, price } = req.query;
    let { zipcode } = reverse.lookup(latitude, longitude, "us");
    let roasterArr = await Roaster.find({ "location.zip": zipcode });
    roasterArr = roasterArr.filter(a => a.price == price);
    console.log(roasterArr);
    res.send(roasterArr);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/**
 * Endpoint .../roasters/price returns an array of roasters given location
 * Method: GET
 */
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

/**
 * Endpoint .../roasters/ takes a body of JSON data to create a new roaster
 * Method: POST
 */
router.post("/", async (req, res) => {
  try {
    const { name, location, coffee, price, rating, extraCost, img } = req.body;

    //Sanitize location street name and number to avoid duplicates
    location.streetName = location.streetName.toLowerCase();

    //See if we can find a roaster that has the same address, it already exists
    let roaster = await Roaster.findOne({
      $and: [
        { "location.streetName": location.streetName },
        { "location.number": location.number }
      ]
    });

    //It exits, so return a message indicating that it already exits
    if (roaster) {
      res.status(400).json({ msg: "This roaster already exists" });

      //If the roaster doesn't exist, but we are missing the required data, send a message responding
    } else if (!name || !location || !coffee || !price) {
      res.status(400).json({
        msg:
          "Please ensure you provided a name, location, coffee and price information."
      });

      //Checks to ensure we have nested object data that we need
      if (!location["zip"] || !location.streetName || !location.number) {
        res.status(400).json({
          msg:
            "Please ensure you provided location with address, number, and zip code"
        });
      }

      //Otherwise we have a valid new roaster. We need to:
      //Get the lat and long of the given address via google geo locator
    } else {
      const options = {
        provider: "google",
        httpAdapter: "https",
        apiKey: `${process.env.GOOGLE_GEO}`,
        formatter: null
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

      //We automatically choose the first result on google
      let { latitude, longitude } = await resArr[0];
      //Set the new record's lat and longitude
      location.latitude = latitude;
      location.longitude = longitude;

      // Create and save the new Roaster in the DB
      roaster = new Roaster({
        name,
        location,
        coffee,
        price,
        rating,
        extraCost,
        img
      });
      await roaster.save();
      res.status(200).json({ msg: `Added new roaster ${name}!` });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
