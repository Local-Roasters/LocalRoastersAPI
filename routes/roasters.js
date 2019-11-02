const express = require("express");
const config = require("config");
// const auth = require("../middleware/requireAuth");
const fetch = require("node-fetch");
const router = express.Router();
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
        Authorization:
          "Bearer BveseQkXptmTE1Vl-l4xSvzVq_rl-18nCPM4o65H7KrbQe2ZlFnsUr8Y19P2tW6hdflNwdbuEonUT2Wm1fLRW83SH_c3a4lyR3O5_I4fMjJiJdTkZL34h51KncycXXYx"
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
      if (!location.zip || !location.streetName || !location.number) {
        res.status(400).json({
          msg:
            "Please ensure you provided location with address, number, and zip code"
        });
      }
    }

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
    res.status(200).json({ msg: `Added new roaster ${name}}!` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/", async (req, res) => {
  try {
    let { zip, price, roast } = req.query;
    let roasterArr = await Roaster.find({ "location.zip": zip });
    console.log(roasterArr);
    res.send(roasterArr);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
