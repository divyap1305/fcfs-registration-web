const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    eventDate: { type: Date, required: true },
    maxCount: { type: Number, required: true },
    currentCount: { type: Number, default: 0 },
    status: { type: String, enum: ["ACTIVE", "CLOSED"], default: "ACTIVE" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
