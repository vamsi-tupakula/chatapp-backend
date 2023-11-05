const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  messages: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("rooms", roomSchema);
