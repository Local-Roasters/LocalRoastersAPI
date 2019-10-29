const express = require("express");
const config = require("config");
const auth = require("../middleware/requireAuth");
// const fetch = require("node-fetch");
const router = express.Router();

//Grab env vars
// const API_KEY = process.env.OWM || config.get("DARK");
//Get roasters via location
router.get("/getRoasters", auth, async (req, res) => {
  try {
    console.log(req.query);
    const { zipcode } = req.query; //De-structure the request's data//
    console.log(zipcode);

    let roasters = await Roaster.find({
      "location.zipcode": zipcode
    });

    console.log(roasters);
    if (!zipcode) {
      return res.status(400).json({
        msg: "Did not send a zipcode!"
      });
    }
    res.json(roasters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}); //Note that "/" here refers to the prefix of "api/users" + "/"

module.exports = router;
