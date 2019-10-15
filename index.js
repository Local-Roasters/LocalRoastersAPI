const express = require("express");
const app = express();
const connectDB = require("./config/db");
connectDB(); //Call and connect to the db

//Allow control origin, then call next middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  next();
});
//Allows us to accept body data
app.use(express.json({ extended: false }));

//Bring in other middleware to use
app.use("/users", require("./routes/users"));
app.use("/roasters", require("./routes/roasters"));

//Home page test
app.get("/", (req, res) => {
  res.json({ msg: "Hello from the backend" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
