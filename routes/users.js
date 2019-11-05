const express = require("express");
// const { check, validationResult } = require("express-validator");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const User = require("../models/User");

/**
 * - Register a user by phone id METHOD: POST
 * - Expects to find a phoneID, ,
 * @params {phoneID} - The user's phone id
 * @params {coffee} - coffee rated (from 1 to 3)
 * @params {price} - price(from 1 to 3) in body as json
 * @returns {JSON} user - Json representation of the found user
 */
router.post("/", async (req, res) => {
  try {
    const { phoneID, coffee, price } = req.body;

    if (!phoneID || !coffee || !price) {
      res.status(400).json({ msg: "Body missing phoneID, coffee, and price" });
    }

    let user = await User.findOne({ phoneID });

    if (user) {
      res.status(401).send("PhoneID already Registered");
    } else {
      user = new User({
        phoneID,
        coffee,
        price
      });
      console.log(user);
      //Save it in the db
      await user.save();
      res
        .status(200)
        .json({ msg: `Added phone with id ${phoneID} to Database.` });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * Get a registered user from the database METHOD: GET
 * @params {Number} phoneID - the user's phone ID
 * @returns {JSON} user - Json representation of the found user
 */
router.get("/", async (req, res) => {
  try {
    const { phoneID } = req.query;
    if (!phoneID) {
      res.status(404).json({ error: "No phoneID provided" });
    }
    const user = await User.findOne({ phoneID: phoneID }); // Return all but the PW
    // if the user exists, return them, verifying the user exists
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

/**
 * Update a registered user from the database METHOD: PUT
 * @params {Number} phoneID - the user's phone ID
 * @params {coffee} - coffee rated (from 1 to 3)
 * @params {price} - price(from 1 to 3) in body as json
 * @returns {JSON} user - Json representation of the found user
 */
router.put("/", async (req, res) => {
  try {
    const { phoneID, coffee, price } = req.body;
    const update = { coffee, price };
    console.log(`User before update${user}.`);
    let user = await User.findOneAndUpdate({ phoneID: phoneID }, update, {
      new: true
    }); // Return all but the PW
    // if the user exists, return their json
    console.log(`User after update${user}.`);
    await user.save();
    res
      .status(200)
      .json({ msg: `Updated profile phone with id ${phoneID} in Database.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
