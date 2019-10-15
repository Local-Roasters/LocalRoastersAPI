const express = require("express");
// const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/requireAuth");
const router = express.Router();
const User = require("../models/User");

//Registering user
router.post("/signup", async (req, res) => {
  //Pull out the data from the request body
  const { email, password, location, coffee, price } = req.body;
  //Check to see if there is a user with that email
  try {
    let user = await User.findOne({
      email
    });
    //Go though the MongoDB and see if the email is already registered
    if (user) {
      return res.status(400).json({
        msg: "User email already in use!"
      });
    }

    //If the email is not already in use make the user
    user = new User({
      email,
      password,
      location,
      coffee,
      price
    });

    //Use bcrypt for password encryption, returns a promise
    const salt = await bcrypt.genSalt(10); //The salt is needed for encryption
    if (!password) {
      res.status(400).send("no Password");
    }
    user.password = await bcrypt.hash(password, salt); //Gives us a hashed version of the password

    //Save it in the db
    await user.save();

    //Payload for jwt
    const payload = {
      user: {
        id: user.id
      }
    };
    //jwt takes: Sign, payload, options, and a call back
    //When it expires they'll have to log back in
    jwt.sign(
      payload,
      process.env.JWS || config.get("jwtSecret"),
      {
        expiresIn: 46000
      },
      (err, token) => {
        if (err) throw err;
        res.json({
          token
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}); //Note that "/" here refers to the prefix of "api/users" + "/"

//Sign in Endpoint
router.post("/login", async (req, res) => {
  //Pull out the email and password
  const { email, password } = req.body;
  //See if it's valid and see if we can hash it and login
  try {
    //Use the User model's method findOne to check if the email is actually registered
    let user = await User.findOne({
      email
    });
    if (!user) {
      return res.status(400).json({
        msg: "Email is not registered."
      });
    }

    //If the email exits, let's check the password via a bcrypt.compare hashing
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: "Incorrect password!"
      });
    }

    //If the pw is correct give this payload for jwt
    const payload = {
      user: {
        id: user.id
      }
    };

    //jwt takes: Sign, payload, options, and a call back
    //When it expires they'll have to log back in
    jwt.sign(
      //Sign the jwt with the payload given the secret and set it to expire.
      payload,
      process.env.JWS || config.get("jwtSecret"), //res.json the token as a object
      (err, token) => {
        if (err) throw err;
        res.json({
          token
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}); //Note that "/" here refers to the prefix of "api/users" + "/"

//Get a user
router.get("/", auth, async (req, res) => {
  try {
    const id = req.id;
    const user = await User.findById(id).select("-password"); // Return all but the PW
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
