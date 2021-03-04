const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema({
  _id: { type: String, required: true },
  commandPrefix: String,
  joinForVC_ID: String,
});

module.exports = mongoose.model("bot-settings", settingsSchema);
