const mongoose = require('mongoose');

const EVENT_STATUS = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
};

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    eventDate: { type: Date, required: true },
    maxCount: { type: Number, required: true, min: 1 },
    currentCount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: [EVENT_STATUS.ACTIVE, EVENT_STATUS.CLOSED],
      default: EVENT_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = {
  Event: mongoose.model('Event', EventSchema),
  EVENT_STATUS,
};
