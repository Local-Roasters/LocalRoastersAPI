const express = require("express");
// const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/requireAuth");
const router = express.Router();
const User = require("../models/User");

//Add a unregistered user to the db
router.post("/", async (req, res) => {
  try {
    const id = req.id;
    const { phoneID, location, coffee, price } = req.body;
    const user = await User.findOne(phoneID); // Return all but the PW
    // if the user exists, return their json
    if (user) {
      res.status(401).send("PhoneID already Registered");
    } else {
      user = new User({
        location,
        coffee,
        price
      });
      console.log(user`);
      //Save it in the db
      await user.save();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Get a user
router.get("/", async (req, res) => {
  try {
    const id = req.id;
    const { phoneID } = req.body;
    const user = await User.findOne(phoneID); // Return all but the PW
    // if the user exists, return their json
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "PhoneID not registered" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
