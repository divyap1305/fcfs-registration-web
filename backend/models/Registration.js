const mongoose = require('mongoose');
const crypto = require('crypto');

const RegistrationSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    registrationId: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
    },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Optional index to speed lookups per event
RegistrationSchema.index({ eventId: 1, rollNumber: 1 });

module.exports = {
  Registration: mongoose.model('Registration', RegistrationSchema),
};
