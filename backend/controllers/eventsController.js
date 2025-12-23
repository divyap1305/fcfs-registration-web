const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { Parser } = require("json2csv");

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, maxCount } = req.body;

    const event = await Event.create({
      title,
      description,
      eventDate,
      maxCount,
      currentCount: 0,
      status: "ACTIVE"
    });

    return res.json({ success: true, event });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error creating event" });
  }
};

// EDIT EVENT
exports.editEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const updated = await Event.findByIdAndUpdate(eventId, req.body, { new: true });

    if (!updated)
      return res.status(404).json({ success: false, message: "Event not found" });

    return res.json({ success: true, event: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error editing event" });
  }
};

// DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    await Registration.deleteMany({ eventId });
    await Event.findByIdAndDelete(eventId);

    return res.json({ success: true, message: "Event deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting event" });
  }
};

// GET ALL EVENTS
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.json({ success: true, events });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

// REGISTER STUDENT
exports.registerToEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { studentName, rollNumber, department } = req.body;

    const event = await Event.findById(eventId);

    if (!event)
      return res.status(404).json({ success: false, message: "Event not found" });

    if (event.currentCount >= event.maxCount)
      return res.status(400).json({ success: false, message: "Slots full" });

    await Registration.create({
      studentName,
      rollNumber,
      department,
      eventId
    });

    event.currentCount += 1;
    if (event.currentCount >= event.maxCount) event.status = "CLOSED";
    await event.save();

    return res.json({ success: true, message: "Registered successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// GET REGISTRATIONS FOR EVENT
exports.getRegistrations = async (req, res) => {
  try {
    const eventId = req.params.id;
    const list = await Registration.find({ eventId });

    return res.json({ success: true, registrations: list });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

// EXPORT CSV
exports.exportCSV = async (req, res) => {
  try {
    const eventId = req.params.id;
    const entries = await Registration.find({ eventId }).lean();

    if (entries.length === 0)
      return res.status(400).json({ success: false, message: "No registrations found" });

    const fields = ["studentName", "rollNumber", "department", "registrationId", "createdAt"];
    const parser = new Parser({ fields });
    const csv = parser.parse(entries);

    res.header("Content-Type", "text/csv");
    res.attachment("registrations.csv");
    return res.send(csv);
  } catch (error) {
    return res.status(500).json({ success: false, message: "CSV export error" });
  }
};
