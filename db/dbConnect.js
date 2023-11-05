require("dotenv").config();
const mongoose = require("mongoose");

async function dbConnect() {
  await mongoose.connect(process.env.DB_URL, { dbName: "chatapp" });
  console.log("Connected to MongoDB database...");
}

module.exports = dbConnect;
