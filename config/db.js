const mongoose = require("mongoose");
const db = process.env.DB;

// Mongoose returns promises, let's use async await and try-catch
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
//Export the database
module.exports = connectDB;
