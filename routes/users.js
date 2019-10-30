const express = require("express");
// const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/requireAuth");
const router = express.Router();
const User = require("../models/User");

//Register a user by phone id
router.post("/", async (req, res) => {
  try {
    const { phoneID, coffee, price } = req.body;
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

//Add a unregistered user to the db
router.put("/", async (req, res) => {
  try {
    const { coffee, price } = req.body;
    const update = { coffee, price };
    console.log(`User before update${user}`);
    let user = await User.findOneAndUpdate({ phoneID: phoneID }, update, {
      new: true
    }); // Return all but the PW
    // if the user exists, return their json
    console.log(`User after update${user}`);
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
