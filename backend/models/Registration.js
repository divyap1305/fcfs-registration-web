const mongoose = require("mongoose");

const regSchema = new mongoose.Schema(
  {
    studentName: String,
    rollNumber: String,
    department: String,
    eventId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", regSchema);
