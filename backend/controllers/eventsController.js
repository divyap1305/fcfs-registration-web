const { Event, EVENT_STATUS } = require('../models/Event');
const { Registration } = require('../models/Registration');

// Helper to format clean JSON responses
function formatEvent(e) {
  return {
    eventId: e._id,
    title: e.title,
    description: e.description,
    eventDate: e.eventDate,
    maxCount: e.maxCount,
    currentCount: e.currentCount,
    status: e.status,
    createdAt: e.createdAt,
  };
}

// POST /events
async function createEvent(req, res) {
  try {
    const { title, description = '', eventDate, maxCount } = req.body;
    if (!title || !eventDate || !maxCount) {
      return res.status(400).json({ message: 'Missing required fields: title, eventDate, maxCount' });
    }

    const event = await Event.create({
      title,
      description,
      eventDate: new Date(eventDate),
      maxCount: Number(maxCount),
      currentCount: 0,
      status: EVENT_STATUS.ACTIVE,
    });

    return res.status(201).json(formatEvent(event));
  } catch (err) {
    console.error('createEvent error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /events/:id/status
async function getEventStatus(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).lean();
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.json({
      eventId: event._id,
      currentCount: event.currentCount,
      maxCount: event.maxCount,
      status: event.status,
    });
  } catch (err) {
    console.error('getEventStatus error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// POST /events/:id/register
async function registerToEvent(req, res) {
  try {
    const { id } = req.params;
    const { studentName, rollNumber, department } = req.body;
    if (!studentName || !rollNumber || !department) {
      return res.status(400).json({ message: 'Missing required fields: studentName, rollNumber, department' });
    }

    // Atomic increment if currentCount < maxCount and status ACTIVE
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id, status: EVENT_STATUS.ACTIVE, $expr: { $lt: ['$currentCount', '$maxCount'] } },
      { $inc: { currentCount: 1 } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(403).json({ message: 'Registration limit reached' });
    }

    // Persist the registration
    const reg = await Registration.create({
      studentName,
      rollNumber,
      department,
      eventId: updatedEvent._id,
    });

    // If limit reached now, mark CLOSED (idempotent guard)
    if (updatedEvent.currentCount >= updatedEvent.maxCount && updatedEvent.status !== EVENT_STATUS.CLOSED) {
      await Event.updateOne(
        { _id: updatedEvent._id, status: EVENT_STATUS.ACTIVE, currentCount: updatedEvent.maxCount },
        { $set: { status: EVENT_STATUS.CLOSED } }
      );
    }

    return res.status(201).json({
      message: 'Registration successful',
      registrationId: reg.registrationId,
      eventId: updatedEvent._id,
      currentCount: updatedEvent.currentCount,
      maxCount: updatedEvent.maxCount,
      status: updatedEvent.currentCount >= updatedEvent.maxCount ? EVENT_STATUS.CLOSED : EVENT_STATUS.ACTIVE,
    });
  } catch (err) {
    console.error('registerToEvent error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createEvent,
  getEventStatus,
  registerToEvent,
};
