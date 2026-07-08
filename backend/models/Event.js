const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    eventDate: Date,
    maxCount: Number,
    currentCount: { type: Number, default: 0 },
    status: { type: String, default: "ACTIVE" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
