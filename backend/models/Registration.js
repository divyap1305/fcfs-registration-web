const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const RegistrationSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    department: { type: String, required: true },
    registrationId: { type: String, default: uuidv4 },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", RegistrationSchema);
