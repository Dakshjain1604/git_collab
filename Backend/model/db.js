const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const dbUri = process.env.MONGODB_URL;

  if (!dbUri) {
    throw new Error("MONGODB_URL is missing. Please add it to your .env file.");
  }

  try {
    await mongoose.connect(dbUri, {
      autoIndex: true,
    });
    console.log("✅ MongoDB connection established");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    throw err;
  }
};

module.exports = connectDB;